import { AdminFormShell } from "@/components/admin/form";
import { LocationForm } from "../location-form";
import { createLocation } from "../actions";

export default function NewLocationPage() {
  return (
    <AdminFormShell title="New Location" backHref="/admin/locations">
      <LocationForm action={createLocation} />
    </AdminFormShell>
  );
}
