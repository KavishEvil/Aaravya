import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCostRule } from "./actions";

export default async function AdminCostRulesPage() {
  const rules = await prisma.costEstimatorRule.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      city: true,
      insuranceType: true,
      costMin: true,
      costMax: true,
      procedure: { select: { name: true } },
    },
  });

  return (
    <div>
      <AdminListHeader title="Cost Estimator Rules" newHref="/admin/cost-rules/new" newLabel="New Rule" />
      <AdminTable
        columns={["Procedure", "City", "Insurance", "Range", ""]}
        rows={rules.map((r) => [
          <Link key="p" href={`/admin/cost-rules/${r.id}`} className="font-medium hover:text-primary">
            {r.procedure.name}
          </Link>,
          r.city,
          r.insuranceType,
          `₹${r.costMin.toLocaleString("en-IN")}–₹${r.costMax.toLocaleString("en-IN")}`,
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/cost-rules/${r.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteCostRule.bind(null, r.id)} />
          </div>,
        ])}
      />
    </div>
  );
}
