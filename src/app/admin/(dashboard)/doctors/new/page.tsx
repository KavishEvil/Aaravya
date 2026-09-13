import { AdminFormShell } from "@/components/admin/form";
import { DoctorForm } from "../doctor-form";
import { createDoctor } from "../actions";

export default function NewDoctorPage() {
  return (
    <AdminFormShell title="New Doctor" backHref="/admin/doctors">
      <DoctorForm action={createDoctor} />
    </AdminFormShell>
  );
}
