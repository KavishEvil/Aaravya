import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteDoctor } from "./actions";

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <AdminListHeader title="Doctors" newHref="/admin/doctors/new" newLabel="New Doctor" />
      <AdminTable
        columns={["Name", "Designation", "Featured", ""]}
        rows={doctors.map((d) => [
          <Link key="name" href={`/admin/doctors/${d.id}`} className="font-medium hover:text-brand">
            {d.name}
          </Link>,
          d.designation,
          d.isFeatured ? "Yes" : "No",
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/doctors/${d.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteDoctor.bind(null, d.id)} confirmText={`Delete ${d.name}?`} />
          </div>,
        ])}
      />
    </div>
  );
}
