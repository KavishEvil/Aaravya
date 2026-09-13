"use server";

import { appointmentSchema } from "@/lib/validations/appointment";
import { createAppointment } from "@/lib/appointments";

export type BookingActionResult =
  | { ok: true; appointmentId: string }
  | { ok: false; message: string };

export async function submitBooking(raw: unknown): Promise<BookingActionResult> {
  const parsed = appointmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  try {
    const appointment = await createAppointment(parsed.data);
    return { ok: true, appointmentId: appointment.id };
  } catch (err) {
    console.error("Failed to create appointment:", err);
    return { ok: false, message: "Something went wrong on our end. Please call us directly at +91 87338 89957." };
  }
}
