import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { ConditionForm } from "../condition-form";
import { createCondition } from "../actions";

export default async function NewConditionPage() {
  const doctors = await prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  return (
    <AdminFormShell title="New Condition" backHref="/admin/conditions">
      <ConditionForm action={createCondition} doctors={doctors} />
    </AdminFormShell>
  );
}
