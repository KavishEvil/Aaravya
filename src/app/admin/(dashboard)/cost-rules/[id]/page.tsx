import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { CostRuleForm } from "../cost-rule-form";
import { updateCostRule } from "../actions";

export default async function EditCostRulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rule, procedures, conditions] = await Promise.all([
    prisma.costEstimatorRule.findUnique({ where: { id } }),
    prisma.procedure.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!rule) notFound();

  return (
    <AdminFormShell title="Edit Cost Rule" backHref="/admin/cost-rules">
      <CostRuleForm action={updateCostRule.bind(null, rule.id)} rule={rule} procedures={procedures} conditions={conditions} />
    </AdminFormShell>
  );
}
