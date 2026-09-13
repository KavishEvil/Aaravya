"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InsuranceType } from "@/generated/prisma";

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

function readCostRuleForm(formData: FormData) {
  return {
    procedureId: String(formData.get("procedureId")),
    conditionId: toStringOrNull(formData.get("conditionId")),
    city: String(formData.get("city")).trim(),
    insuranceType: String(formData.get("insuranceType")) as InsuranceType,
    costMin: Number(formData.get("costMin")),
    costMax: Number(formData.get("costMax")),
    notes: toStringOrNull(formData.get("notes")),
  };
}

export async function createCostRule(formData: FormData) {
  const data = readCostRuleForm(formData);
  await prisma.costEstimatorRule.create({ data });
  revalidatePath("/admin/cost-rules");
  revalidatePath("/cost");
  redirect("/admin/cost-rules");
}

export async function updateCostRule(id: string, formData: FormData) {
  const data = readCostRuleForm(formData);
  await prisma.costEstimatorRule.update({ where: { id }, data });
  revalidatePath("/admin/cost-rules");
  revalidatePath("/cost");
  redirect("/admin/cost-rules");
}

export async function deleteCostRule(id: string) {
  await prisma.costEstimatorRule.delete({ where: { id } });
  revalidatePath("/admin/cost-rules");
  revalidatePath("/cost");
}
