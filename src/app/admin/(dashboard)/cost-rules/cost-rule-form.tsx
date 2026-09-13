import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import type { CostEstimatorRule } from "@/generated/prisma";

export function CostRuleForm({
  action,
  rule,
  procedures,
  conditions,
}: {
  action: (formData: FormData) => Promise<void>;
  rule?: CostEstimatorRule;
  procedures: { id: string; name: string }[];
  conditions: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
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
            <option value="CASHLESS">Cashless</option>
            <option value="REIMBURSEMENT">Reimbursement</option>
            <option value="NONE">No Insurance</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cost Min (₹)" htmlFor="costMin">
          <input id="costMin" name="costMin" type="number" required defaultValue={rule?.costMin ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Cost Max (₹)" htmlFor="costMax">
          <input id="costMax" name="costMax" type="number" required defaultValue={rule?.costMax ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={2} defaultValue={rule?.notes ?? ""} />
      </Field>

      <Button type="submit" size="xl" className="mt-2 bg-brand text-brand-foreground hover:bg-brand/90">
        Save Rule
      </Button>
    </form>
  );
}
