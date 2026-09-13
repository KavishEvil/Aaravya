import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book an in-clinic visit or teleconsultation at Aaravya Hospital, Chandkheda, Ahmedabad.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ condition?: string; doctor?: string }>;
}) {
  const { condition: conditionSlug, doctor: doctorSlug } = await searchParams;

  const [conditions, doctors, defaultCondition, defaultDoctor] = await Promise.all([
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ select: { id: true, name: true } }),
    conditionSlug
      ? prisma.condition.findUnique({ where: { slug: conditionSlug }, select: { id: true } })
      : null,
    doctorSlug
      ? prisma.doctor.findUnique({ where: { slug: doctorSlug }, select: { id: true } })
      : null,
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">Book an Appointment</h1>
        <p className="mt-3 text-muted-foreground">
          Tell us a little about what you need — our coordinator will call to confirm your slot.
        </p>
      </div>

      <div className="mt-10">
        <BookingForm
          conditions={conditions}
          doctors={doctors}
          defaultConditionId={defaultCondition?.id}
          defaultDoctorId={defaultDoctor?.id}
        />
      </div>
    </div>
  );
}
