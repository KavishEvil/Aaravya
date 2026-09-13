"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@/generated/prisma";

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  await prisma.appointment.update({ where: { id }, data: { status } });
  revalidatePath("/admin/appointments");
}

export async function deleteAppointment(id: string) {
  await prisma.appointment.delete({ where: { id } });
  revalidatePath("/admin/appointments");
}
