"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

function readLocationForm(formData: FormData) {
  return {
    name: String(formData.get("name")).trim(),
    address: String(formData.get("address")).trim(),
    phone: String(formData.get("phone")).trim(),
    whatsapp: toStringOrNull(formData.get("whatsapp")),
    email: toStringOrNull(formData.get("email")),
    mapEmbedUrl: toStringOrNull(formData.get("mapEmbedUrl")),
    hours: toStringOrNull(formData.get("hours")),
    googleBusinessUrl: toStringOrNull(formData.get("googleBusinessUrl")),
    isPrimary: formData.get("isPrimary") === "on",
  };
}

export async function createLocation(formData: FormData) {
  const data = readLocationForm(formData);
  await prisma.location.create({ data });
  revalidatePath("/admin/locations");
  revalidatePath("/contact");
  redirect("/admin/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  const data = readLocationForm(formData);
  await prisma.location.update({ where: { id }, data });
  revalidatePath("/admin/locations");
  revalidatePath("/contact");
  revalidatePath("/");
  redirect("/admin/locations");
}

export async function deleteLocation(id: string) {
  await prisma.location.delete({ where: { id } });
  revalidatePath("/admin/locations");
  revalidatePath("/contact");
}
