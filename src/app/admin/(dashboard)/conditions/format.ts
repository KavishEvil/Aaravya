export function treatmentOptionsToText(options: unknown): string {
  if (!Array.isArray(options)) return "";
  return options
    .map((o) => {
      if (o && typeof o === "object" && "title" in o) {
        const opt = o as { title: string; description?: string };
        return `${opt.title} | ${opt.description ?? ""}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}
