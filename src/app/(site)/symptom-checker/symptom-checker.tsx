"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BLEEDING_OPTIONS,
  DURATION_OPTIONS,
  PAIN_OPTIONS,
  SYMPTOM_TYPE_OPTIONS,
  type SymptomAnswers,
  type UrgencyResult,
} from "@/content/symptom-checker";
import { logSymptomSession } from "./actions";

type Step = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = ["Symptoms", "Duration", "Bleeding", "Pain", "Result"];

export function SymptomChecker() {
  const [step, setStep] = useState<Step>(0);
  const [symptomTypes, setSymptomTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState<SymptomAnswers["duration"] | null>(null);
  const [bleeding, setBleeding] = useState<SymptomAnswers["bleeding"] | null>(null);
  const [pain, setPain] = useState<SymptomAnswers["pain"] | null>(null);
  const [result, setResult] = useState<UrgencyResult | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleSymptomType(value: string) {
    setSymptomTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function finish(finalPain: SymptomAnswers["pain"]) {
    setLoading(true);
    const answers: SymptomAnswers = {
      symptomTypes,
      duration: duration!,
      bleeding: bleeding!,
      pain: finalPain,
    };
    const res = await logSymptomSession(answers);
    setResult(res);
    setLoading(false);
    setStep(4);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {step < 4 && (
        <div className="mb-6 flex items-center gap-2">
          {STEP_LABELS.slice(0, 4).map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-muted"}`}
              />
            </div>
          ))}
        </div>
      )}

      {step === 0 && (
        <div>
          <h2 className="font-heading text-xl font-semibold">What are you experiencing?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Select all that apply.</p>
          <div className="mt-5 flex flex-col gap-2.5">
            {SYMPTOM_TYPE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={symptomTypes.includes(opt.value)}
                  onChange={() => toggleSymptomType(opt.value)}
                  className="size-4 rounded border-input"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <Button
            size="xl"
            className="mt-6 w-full bg-brand text-brand-foreground hover:bg-brand/90"
            disabled={symptomTypes.length === 0}
            onClick={() => setStep(1)}
          >
            Continue <ArrowRight className="ml-1" />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-heading text-xl font-semibold">How long has this been going on?</h2>
          <div className="mt-5 flex flex-col gap-2.5">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setDuration(opt.value);
                  setStep(2);
                }}
                className="flex items-center justify-between rounded-xl border border-border p-3.5 text-left text-sm hover:border-brand hover:bg-accent"
              >
                {opt.label}
                <ArrowRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-heading text-xl font-semibold">Any bleeding?</h2>
          <div className="mt-5 flex flex-col gap-2.5">
            {BLEEDING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setBleeding(opt.value);
                  setStep(3);
                }}
                className="flex items-center justify-between rounded-xl border border-border p-3.5 text-left text-sm hover:border-brand hover:bg-accent"
              >
                {opt.label}
                <ArrowRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-heading text-xl font-semibold">How much pain or discomfort?</h2>
          <div className="mt-5 flex flex-col gap-2.5">
            {PAIN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                disabled={loading}
                onClick={() => {
                  setPain(opt.value);
                  finish(opt.value);
                }}
                className="flex items-center justify-between rounded-xl border border-border p-3.5 text-left text-sm hover:border-brand hover:bg-accent disabled:opacity-50"
              >
                {opt.label}
                <ArrowRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="text-center">
          {result.level === "URGENT" ? (
            <AlertTriangle className="mx-auto size-10 text-destructive" />
          ) : (
            <CheckCircle2 className="mx-auto size-10 text-brand" />
          )}
          <p className="mt-4 font-heading text-xl font-semibold">{result.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {result.level === "URGENT" ? (
              <Button size="xl" render={<a href="tel:+918733889957" />} className="bg-destructive text-white hover:bg-destructive/90">
                <Phone className="mr-1.5" /> Call +91 87338 89957 Now
              </Button>
            ) : (
              <Button size="xl" render={<Link href="/book" />} className="bg-brand text-brand-foreground hover:bg-brand/90">
                Book a Consultation
              </Button>
            )}
            <Button size="xl" variant="outline" render={<a href="https://wa.me/918733889957" />}>
              WhatsApp Us
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
