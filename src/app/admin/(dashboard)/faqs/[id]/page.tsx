import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { FaqForm } from "../faq-form";
import { updateFaq } from "../actions";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [faq, conditions] = await Promise.all([
    prisma.faq.findUnique({ where: { id } }),
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!faq) notFound();

  return (
    <AdminFormShell title="Edit FAQ" backHref="/admin/faqs">
      <FaqForm action={updateFaq.bind(null, faq.id)} faq={faq} conditions={conditions} />
    </AdminFormShell>
  );
}
