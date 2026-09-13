"use server";

import { anonymousRequestSchema } from "@/lib/validations/anonymous-request";
import { createAppointment } from "@/lib/appointments";
import { prisma } from "@/lib/prisma";
import { AnonymousCategory } from "@/generated/prisma";
import { getAnonymousCategory } from "@/content/anonymous-categories";

export type AnonymousActionResult = { ok: true } | { ok: false; message: string };

export async function submitAnonymousRequest(
  categorySlug: string,
  raw: unknown
): Promise<AnonymousActionResult> {
  const category = getAnonymousCategory(categorySlug);
  if (!category) {
    return { ok: false, message: "Invalid category." };
  }

  const parsed = anonymousRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  try {
    let doctorId: string | undefined;
    if (parsed.data.preferFemaleDoctor) {
      const femaleDoctor = await prisma.doctor.findUnique({
        where: { slug: "dr-dipti-prajapati" },
        select: { id: true },
      });
      doctorId = femaleDoctor?.id;
    }

    await createAppointment({
      nickname: parsed.data.nickname,
      phone: parsed.data.phone,
      email: parsed.data.email,
      notes: parsed.data.notes,
      type: "TELECONSULT",
      isAnonymous: true,
      anonymousCategory: category.dbValue as AnonymousCategory,
      doctorId,
    });
    return { ok: true };
  } catch (err) {
    console.error("Failed to create anonymous request:", err);
    return {
      ok: false,
      message: "Something went wrong on our end. Message us on WhatsApp instead — it's just as private.",
    };
  }
}
