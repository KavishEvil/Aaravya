import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import { INSURANCE_LABELS } from "@/lib/queries";
import type { CostEstimatorRule } from "@/generated/prisma";

export function CostRuleForm({
  action,
  rule,
  procedures,
  conditions,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  rule?: CostEstimatorRule;
  procedures: { id: string; name: string }[];
  conditions: { id: string; name: string }[];
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <Field label="Procedure" htmlFor="procedureId">
        <select id="procedureId" name="procedureId" required defaultValue={rule?.procedureId ?? ""} className={ADMIN_INPUT_CLASS}>
          <option value="" disabled>
            Select a procedure
          </option>
          {procedures.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Related Condition (optional)" htmlFor="conditionId">
        <select id="conditionId" name="conditionId" defaultValue={rule?.conditionId ?? ""} className={ADMIN_INPUT_CLASS}>
          <option value="">— None —</option>
          {conditions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City" htmlFor="city">
          <input id="city" name="city" required defaultValue={rule?.city ?? "Ahmedabad"} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Insurance Type" htmlFor="insuranceType">
          <select id="insuranceType" name="insuranceType" defaultValue={rule?.insuranceType ?? "CASHLESS"} className={ADMIN_INPUT_CLASS}>
            {Object.entries(INSURANCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cost Min (₹)" htmlFor="costMin">
          <input id="costMin" name="costMin" type="number" min={0} step={1} required defaultValue={rule?.costMin ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Cost Max (₹)" htmlFor="costMax">
          <input id="costMax" name="costMax" type="number" min={0} step={1} required defaultValue={rule?.costMax ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes" help="Shown under the price on the public Cost & Insurance page">
        <Textarea id="notes" name="notes" rows={2} defaultValue={rule?.notes ?? ""} />
      </Field>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Rule
      </AdminSubmitButton>
    </AdminForm>
  );
}
