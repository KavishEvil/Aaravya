import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { SymptomChecker } from "./symptom-checker";

export const metadata: Metadata = {
  title: "AI Symptom Checker",
  description: "A private, guided symptom check for anorectal symptoms — not a diagnosis.",
};

export default function SymptomCheckerPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">Symptom Checker</h1>
        <p className="mt-3 text-muted-foreground">
          Four quick questions to help you decide what to do next.
        </p>
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
        <p>
          <strong className="text-foreground">This is not a diagnosis.</strong> It only
          suggests whether self-care, a routine consult, or urgent care fits what
          you've described. For any medical concern, please consult a doctor. Your
          answers are logged anonymously to improve this tool — no name is collected here.
        </p>
      </div>

      <div className="mt-8">
        <SymptomChecker />
      </div>
    </div>
  );
}
