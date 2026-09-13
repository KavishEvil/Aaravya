import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import type { Faq } from "@/generated/prisma";

export function FaqForm({
  action,
  faq,
  conditions,
}: {
  action: (formData: FormData) => Promise<void>;
  faq?: Faq;
  conditions: { id: string; name: string }[];
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Question" htmlFor="question">
        <input id="question" name="question" required defaultValue={faq?.question} className={ADMIN_INPUT_CLASS} />
      </Field>

      <Field label="Answer" htmlFor="answer">
        <Textarea id="answer" name="answer" rows={4} required defaultValue={faq?.answer} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Related Condition (optional)" htmlFor="conditionId">
          <select id="conditionId" name="conditionId" defaultValue={faq?.conditionId ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">— None —</option>
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Page" htmlFor="pageContext">
          <select id="pageContext" name="pageContext" defaultValue={faq?.pageContext ?? "faqs-page"} className={ADMIN_INPUT_CLASS}>
            <option value="faqs-page">FAQs page</option>
            <option value="homepage">Homepage</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Topic Tag" htmlFor="topic">
          <input id="topic" name="topic" defaultValue={faq?.topic ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Sort Order" htmlFor="sortOrder">
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={faq?.sortOrder ?? 0} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Button type="submit" size="xl" className="mt-2 bg-brand text-brand-foreground hover:bg-brand/90">
        Save FAQ
      </Button>
    </form>
  );
}
