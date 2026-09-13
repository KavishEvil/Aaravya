import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { LocationForm } from "../location-form";
import { updateLocation } from "../actions";

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const location = await prisma.location.findUnique({ where: { id } });
  if (!location) notFound();

  return (
    <AdminFormShell title={`Edit ${location.name}`} backHref="/admin/locations">
      <LocationForm action={updateLocation.bind(null, location.id)} location={location} />
    </AdminFormShell>
  );
}
