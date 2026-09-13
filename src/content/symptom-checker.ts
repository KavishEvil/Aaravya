export type SymptomAnswers = {
  symptomTypes: string[];
  duration: "under_week" | "one_to_four_weeks" | "over_month";
  bleeding: "none" | "occasional" | "every_time" | "heavy";
  pain: "none" | "mild" | "moderate" | "severe";
};

export type UrgencyLevel = "SELF_CARE" | "BOOK" | "URGENT";

export type UrgencyResult = {
  level: UrgencyLevel;
  title: string;
  message: string;
};

export const SYMPTOM_TYPE_OPTIONS = [
  { value: "bleeding", label: "Bleeding during bowel movements" },
  { value: "pain", label: "Pain or discomfort near the anus" },
  { value: "lump", label: "A lump or swelling near the anus" },
  { value: "itching", label: "Itching or irritation" },
  { value: "discharge", label: "Discharge or pus" },
] as const;

export const DURATION_OPTIONS = [
  { value: "under_week", label: "Less than a week" },
  { value: "one_to_four_weeks", label: "1 to 4 weeks" },
  { value: "over_month", label: "More than a month" },
] as const;

export const BLEEDING_OPTIONS = [
  { value: "none", label: "No bleeding" },
  { value: "occasional", label: "Occasional spotting (bright red)" },
  { value: "every_time", label: "Bleeding almost every bowel movement" },
  { value: "heavy", label: "Heavy or continuous bleeding" },
] as const;

export const PAIN_OPTIONS = [
  { value: "none", label: "No pain" },
  { value: "mild", label: "Mild — noticeable but manageable" },
  { value: "moderate", label: "Moderate — hard to ignore" },
  { value: "severe", label: "Severe — difficult to sit or walk" },
] as const;

/**
 * Deterministic triage — never a diagnosis. Checked in priority order: the
 * single most severe signal (heavy bleeding or severe pain) always wins,
 * any bleeding at all is treated as at least "book a consult" since ruling
 * out serious causes needs a professional look regardless of how minor it
 * seems, and only truly mild/short-duration/no-bleeding cases get self-care.
 */
export function computeUrgency(answers: SymptomAnswers): UrgencyResult {
  if (answers.bleeding === "heavy" || answers.pain === "severe") {
    return {
      level: "URGENT",
      title: "Please seek care today",
      message:
        "Heavy bleeding or severe pain should be checked promptly. Please call us right away, or go to the nearest emergency room if you can't reach us immediately.",
    };
  }

  if (
    answers.bleeding === "every_time" ||
    answers.bleeding === "occasional" ||
    answers.pain === "moderate" ||
    (answers.symptomTypes.includes("lump") && answers.duration === "over_month") ||
    answers.duration === "over_month"
  ) {
    return {
      level: "BOOK",
      title: "Worth booking a consult",
      message:
        "What you're describing is common and very treatable, but it's best assessed by a doctor rather than managed on your own — especially anything involving bleeding. We'd suggest booking a consult, in-clinic or by video.",
    };
  }

  return {
    level: "SELF_CARE",
    title: "Likely manageable with self-care, for now",
    message:
      "Mild, short-term symptoms like this often settle with more fibre and water, and avoiding straining. If it hasn't improved in a week, or anything changes, book a consult rather than waiting it out.",
  };
}

/** Shared with the chat widget's free-text FAQ search — an immediate escalation
 * regardless of what else the user typed or answered. */
export const RED_FLAG_KEYWORDS = [
  "heavy bleeding",
  "can't stop bleeding",
  "cant stop bleeding",
  "a lot of blood",
  "lot of blood",
  "won't stop bleeding",
  "wont stop bleeding",
  "severe pain",
  "unbearable",
  "fever",
  "dizzy",
  "dizziness",
  "passing out",
  "fainted",
  "faint",
  "pale",
  "vomiting blood",
];

export function containsRedFlag(text: string): boolean {
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.some((kw) => lower.includes(kw));
}
