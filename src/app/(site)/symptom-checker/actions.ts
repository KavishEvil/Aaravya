"use server";

import { prisma } from "@/lib/prisma";
import { computeUrgency, type SymptomAnswers } from "@/content/symptom-checker";

export async function logSymptomSession(answers: SymptomAnswers) {
  const result = computeUrgency(answers);
  try {
    await prisma.symptomCheckSession.create({
      data: {
        answers,
        urgencyResult: result.level,
      },
    });
  } catch (err) {
    console.error("Failed to log symptom check session:", err);
  }
  return result;
}
