import crypto from "crypto";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

/**
 * Image storage abstraction. Every admin form that accepts an image goes
 * through `uploadImage`/`deleteImage` here rather than touching Supabase
 * Storage directly, so callers stay backend-agnostic.
 *
 * BACKEND: Supabase Storage. `folder` is the target bucket name — buckets
 * are provisioned 1:1 per resource (`doctors`, `conditions`, `procedures`,
 * `gallery`, `testimonials`, `consultation-categories`), each public so
 * `getPublicUrl` returns a directly renderable URL with no signing. Uses the
 * service-role key: these calls only ever run from admin server actions
 * (already behind the `/admin` auth gate), never from the browser.
 */

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB raw upload cap (client also caps lower, see ImageUploadField)
const MAX_DIMENSION = 1600; // longest side, px, after resize

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export class ImageValidationError extends Error {}

export interface UploadedImage {
  /** Public URL to store on the Prisma record and render with next/image. */
  url: string;
  /** Storage key to pass back to `deleteImage` later (on replace/delete). */
  key: string;
}

/**
 * Sniffs the real file type from its magic bytes rather than trusting the
 * browser-reported MIME type or the file extension, since either can be
 * spoofed by a malicious or simply mislabeled upload.
 */
function detectRealImageType(buffer: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

/**
 * Validates, resizes/compresses (via sharp), and uploads an image to Supabase
 * Storage. `folder` is the destination bucket name (e.g. "doctors",
 * "conditions") — the bucket must already exist.
 *
 * Throws `ImageValidationError` (safe to show to the admin) if the file
 * isn't a real, supported image or is too large. Never partially writes —
 * either this resolves with a usable URL, or nothing is written at all, so
 * callers can safely persist the returned URL straight to the database.
 */
export async function uploadImage(file: File, folder: string): Promise<UploadedImage> {
  if (!file || file.size === 0) {
    throw new ImageValidationError("No file was received.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageValidationError("That image is too large (max 8MB).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const realType = detectRealImageType(buffer);
  if (!realType) {
    throw new ImageValidationError("That file isn't a supported image (JPEG, PNG, or WebP).");
  }

  let processed: Buffer;
  try {
    processed = await sharp(buffer)
      .rotate() // apply EXIF orientation, then strip it
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new ImageValidationError("That image couldn't be processed — it may be corrupted.");
  }

  const filename = `${crypto.randomUUID()}.webp`;
  const supabase = supabaseAdmin();
  const { error } = await supabase.storage.from(folder).upload(filename, processed, {
    contentType: "image/webp",
    upsert: false,
  });
  if (error) {
    throw new Error(`Failed to upload image to Supabase Storage bucket "${folder}": ${error.message}`);
  }

  const { data } = supabase.storage.from(folder).getPublicUrl(filename);
  const key = `${folder}/${filename}`;
  return { url: data.publicUrl, key };
}

/** Deletes a previously-uploaded image by its storage key (`bucket/filename`).
 * Safe to call with `null`/`undefined` (no-op), and safe to call on a file
 * that's already gone. */
export async function deleteImage(key: string | null | undefined): Promise<void> {
  if (!key) return;
  const slash = key.indexOf("/");
  if (slash <= 0) return;
  const bucket = key.slice(0, slash);
  const path = key.slice(slash + 1);
  if (!path) return;
  try {
    await supabaseAdmin().storage.from(bucket).remove([path]);
  } catch {
    // Already gone, never existed, or storage unreachable — nothing more we
    // can do from here; the DB record's own write already went through.
  }
}

/**
 * Resolves an `ImageUploadField` submission (a `File` under `field`, plus a
 * `${field}__remove` flag) into the value to persist. A newly-picked file
 * wins, then an explicit removal, otherwise `previousUrl` is kept. The
 * replaced file is deleted from storage. Throws `ImageValidationError` for a
 * bad file, which `adminAction` turns into a message on the form.
 */
export async function resolveImageUpload(
  formData: FormData,
  field: string,
  bucket: string,
  previousUrl: string | null
): Promise<string | null> {
  const file = formData.get(field);
  const hasNewFile = file instanceof File && file.size > 0;
  const removeRequested = formData.get(`${field}__remove`) === "1";

  if (hasNewFile) {
    const uploaded = await uploadImage(file, bucket);
    await deleteImage(keyFromUrl(previousUrl));
    return uploaded.url;
  }
  if (removeRequested) {
    await deleteImage(keyFromUrl(previousUrl));
    return null;
  }
  return previousUrl;
}

/**
 * Recovers the storage key from a URL previously returned by `uploadImage`,
 * so a form's server action can clean up the old file on replace/delete.
 * Returns `null` for anything not a Supabase Storage public URL for one of
 * our own buckets (a legacy `/uploads/...` or `assets/img/...` path from the
 * old static site, an external URL, or already empty) — those should never
 * be deleted by this function.
 */
export function keyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = "/storage/v1/object/public/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const key = url.slice(idx + marker.length);
  return key.length > 0 ? key : null;
}
