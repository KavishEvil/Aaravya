import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { FaqForm } from "../faq-form";
import { createFaq } from "../actions";

export default async function NewFaqPage() {
  const conditions = await prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  return (
    <AdminFormShell title="New FAQ" backHref="/admin/faqs">
      <FaqForm action={createFaq} conditions={conditions} />
    </AdminFormShell>
  );
}
