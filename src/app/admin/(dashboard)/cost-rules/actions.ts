"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InsuranceType } from "@/generated/prisma";
import {
  AdminFormError,
  adminAction,
  enumValue,
  requiredString,
  revalidatePublicSite,
  toIntOrNull,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";

function readAmount(formData: FormData, key: string, label: string) {
  const n = toIntOrNull(formData.get(key));
  if (n === null || n < 0) throw new AdminFormError(`${label} must be a whole number of rupees, 0 or more.`);
  return n;
}

function readCostRuleForm(formData: FormData) {
  const costMin = readAmount(formData, "costMin", "Cost Min");
  const costMax = readAmount(formData, "costMax", "Cost Max");
  if (costMin > costMax) throw new AdminFormError("Cost Min can't be higher than Cost Max.");
  return {
    procedureId: requiredString(formData, "procedureId", "Procedure"),
    conditionId: toStringOrNull(formData.get("conditionId")),
    city: requiredString(formData, "city", "City"),
    insuranceType: enumValue(InsuranceType, formData.get("insuranceType"), "insurance type"),
    costMin,
    costMax,
    notes: toStringOrNull(formData.get("notes")),
  };
}

export async function createCostRule(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    await prisma.costEstimatorRule.create({ data: readCostRuleForm(formData) });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/cost-rules");
}

export async function updateCostRule(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    await prisma.costEstimatorRule.update({ where: { id }, data: readCostRuleForm(formData) });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/cost-rules");
}

export async function deleteCostRule(id: string): Promise<FormState> {
  return adminAction(async () => {
    await prisma.costEstimatorRule.delete({ where: { id } });
    revalidatePublicSite();
  });
}
