import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { DoctorForm } from "../doctor-form";
import { updateDoctor } from "../actions";

export default async function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) notFound();

  return (
    <AdminFormShell title={`Edit ${doctor.name}`} backHref="/admin/doctors">
      <DoctorForm action={updateDoctor.bind(null, doctor.id)} doctor={doctor} />
    </AdminFormShell>
  );
}
