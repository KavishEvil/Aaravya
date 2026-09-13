import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { CostRuleForm } from "../cost-rule-form";
import { createCostRule } from "../actions";

export default async function NewCostRulePage() {
  const [procedures, conditions] = await Promise.all([
    prisma.procedure.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminFormShell title="New Cost Rule" backHref="/admin/cost-rules">
      <CostRuleForm action={createCostRule} procedures={procedures} conditions={conditions} />
    </AdminFormShell>
  );
}
