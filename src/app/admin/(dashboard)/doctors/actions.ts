"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) ? n : null;
}

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

function readDoctorForm(formData: FormData) {
  return {
    slug: String(formData.get("slug")).trim(),
    name: String(formData.get("name")).trim(),
    qualifications: String(formData.get("qualifications")).trim(),
    designation: String(formData.get("designation")).trim(),
    photoUrl: toStringOrNull(formData.get("photoUrl")),
    registrationNumber: toStringOrNull(formData.get("registrationNumber")),
    yearsExperience: toIntOrNull(formData.get("yearsExperience")),
    surgeriesCount: toIntOrNull(formData.get("surgeriesCount")),
    specializations: linesToArray(formData.get("specializations")),
    bioParagraphs: linesToArray(formData.get("bioParagraphs")),
    philosophy: toStringOrNull(formData.get("philosophy")),
    phone: toStringOrNull(formData.get("phone")),
    facebookUrl: toStringOrNull(formData.get("facebookUrl")),
    instagramUrl: toStringOrNull(formData.get("instagramUrl")),
    linkedinUrl: toStringOrNull(formData.get("linkedinUrl")),
    isFeatured: formData.get("isFeatured") === "on",
  };
}

export async function createDoctor(formData: FormData) {
  const data = readDoctorForm(formData);
  await prisma.doctor.create({ data });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  redirect("/admin/doctors");
}

export async function updateDoctor(id: string, formData: FormData) {
  const data = readDoctorForm(formData);
  await prisma.doctor.update({ where: { id }, data });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  revalidatePath(`/doctors/${data.slug}`);
  redirect("/admin/doctors");
}

export async function deleteDoctor(id: string) {
  await prisma.doctor.delete({ where: { id } });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
}
