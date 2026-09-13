import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqs } from "@/lib/queries";
import { JsonLd } from "@/components/json-ld";
import { faqPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about piles, fissure, fistula, and other conditions treated at Aaravya Hospital.",
};

export default async function FaqsPage() {
  const faqs = await getFaqs("faqs-page");
  const schema = faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd data={schema} />
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Straight answers to the questions patients ask us most.
        </p>
      </div>

      <Accordion className="mt-10">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
