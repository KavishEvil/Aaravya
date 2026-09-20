import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

/**
 * Image storage abstraction. Every admin form that accepts an image goes
 * through `uploadImage`/`deleteImage` here rather than touching the
 * filesystem (or a cloud bucket) directly, so the actual backend can be
 * swapped later without touching any form/action code.
 *
 * CURRENT BACKEND: local disk, under `public/uploads/`. This is a
 * placeholder, not a production recommendation — the brief this was built
 * against explicitly calls for a real object storage provider (Vercel Blob,
 * Cloudflare R2, or S3-compatible) before any real deployment, since local
 * container storage isn't durable or shareable across instances. In this
 * project's Docker Compose dev setup specifically, `./:/app` is bind-mounted
 * so files written here DO persist across container restarts on the host
 * machine — but that's a dev-environment coincidence, not something to rely
 * on in production. Swap this file's internals for a real provider's SDK
 * once credentials are available; every caller (`uploadImage`/`deleteImage`)
 * keeps the same signature either way.
 */

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB raw upload cap (client also caps lower, see ImageUploadField)
const MAX_DIMENSION = 1600; // longest side, px, after resize

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
 * Validates, resizes/compresses (via sharp), and stores an uploaded image.
 * `folder` groups files by the resource they belong to (e.g. "doctors",
 * "gallery", "blog") purely for organization on disk.
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

  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  const filename = `${crypto.randomUUID()}.webp`;
  await writeFile(path.join(dir, filename), processed);

  const key = `${folder}/${filename}`;
  return { url: `/uploads/${key}`, key };
}

/** Deletes a previously-uploaded image by its storage key. Safe to call
 * with `null`/`undefined` (no-op), and safe to call on a file that's
 * already gone. */
export async function deleteImage(key: string | null | undefined): Promise<void> {
  if (!key) return;
  const safeKey = key.replace(/^\/+/, "").replace(/\.\./g, "");
  const filePath = path.join(UPLOAD_ROOT, safeKey);
  if (!filePath.startsWith(UPLOAD_ROOT)) return; // never delete outside our own uploads root
  try {
    await unlink(filePath);
  } catch {
    // Already gone, or never existed — nothing to do.
  }
}

/**
 * Recovers the storage key from a URL previously returned by `uploadImage`,
 * so a form's server action can clean up the old file on replace/delete.
 * Returns `null` for anything not under our own `/uploads/` path (a legacy
 * asset path, an external URL, or already empty) — those should never be
 * deleted by this function.
 */
export function keyFromUrl(url: string | null | undefined): string | null {
  if (!url || !url.startsWith("/uploads/")) return null;
  return url.slice("/uploads/".length);
}
