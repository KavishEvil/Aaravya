import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { AnonymousCategory, AppointmentType } from "@/generated/prisma";

export type CreateAppointmentInput = {
  name?: string;
  nickname?: string;
  phone: string;
  email?: string;
  type: AppointmentType;
  conditionId?: string;
  doctorId?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  notes?: string;
  isAnonymous?: boolean;
  anonymousCategory?: AnonymousCategory;
};

const COORDINATOR_EMAIL = process.env.COORDINATOR_EMAIL ?? "aaravyahospital@gmail.com";

export async function createAppointment(input: CreateAppointmentInput) {
  const appointment = await prisma.appointment.create({
    data: {
      name: input.name || null,
      nickname: input.nickname || null,
      phone: input.phone,
      email: input.email || null,
      type: input.type,
      conditionId: input.conditionId || null,
      doctorId: input.doctorId || null,
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
      preferredTimeSlot: input.preferredTimeSlot || null,
      notes: input.notes || null,
      isAnonymous: input.isAnonymous ?? false,
      anonymousCategory: input.anonymousCategory ?? null,
    },
    include: { condition: true, doctor: true },
  });

  const displayName = appointment.isAnonymous
    ? appointment.nickname || "Anonymous patient"
    : appointment.name || "Patient";
  const visitType = appointment.type === "IN_CLINIC" ? "In-Clinic Visit" : "Teleconsultation";

  const detailRows = [
    ["Type", visitType],
    ["Name / Nickname", displayName],
    ["Phone", appointment.phone],
    appointment.email ? ["Email", appointment.email] : null,
    appointment.condition ? ["Condition", appointment.condition.name] : null,
    appointment.doctor ? ["Preferred Doctor", appointment.doctor.name] : null,
    appointment.preferredDate
      ? ["Preferred Date", appointment.preferredDate.toLocaleDateString("en-IN")]
      : null,
    appointment.preferredTimeSlot ? ["Preferred Time", appointment.preferredTimeSlot] : null,
    appointment.isAnonymous ? ["Anonymous Category", appointment.anonymousCategory] : null,
    appointment.notes ? ["Notes", appointment.notes] : null,
  ].filter((row): row is [string, string] => row !== null);

  const rowsHtml = detailRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${label}</td><td style="padding:4px 0;font-weight:600;">${value}</td></tr>`
    )
    .join("");

  await sendMail({
    to: COORDINATOR_EMAIL,
    subject: `New ${visitType} request — ${displayName}`,
    html: `
      <h2 style="color:#3a653d;">New Appointment Request</h2>
      <table>${rowsHtml}</table>
      <p style="margin-top:16px;color:#6b7280;font-size:13px;">Submitted via aaravyahospital.com booking form.</p>
    `,
  }).catch((err) => console.error("Failed to send coordinator notification email:", err));

  if (appointment.email) {
    await sendMail({
      to: appointment.email,
      subject: "We've received your appointment request — Aaravya Hospital",
      html: `
        <h2 style="color:#3a653d;">Thank you, ${displayName}</h2>
        <p>We've received your ${visitType.toLowerCase()} request${
        appointment.condition ? ` for <strong>${appointment.condition.name}</strong>` : ""
      }. Our coordinator will call you at ${appointment.phone} shortly to confirm your slot.</p>
        <p style="color:#6b7280;font-size:13px;">If you need to reach us sooner, call +91 87338 89957 or WhatsApp us anytime.</p>
      `,
    }).catch((err) => console.error("Failed to send patient confirmation email:", err));
  }

  return appointment;
}
