import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export function Wordmark({
  variant = "default",
  className,
}: {
  variant?: "default" | "inverted";
  className?: string;
}) {
  const inverted = variant === "inverted";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg",
          inverted ? "bg-white/15 text-white" : "bg-brand/10 text-brand"
        )}
      >
        <Stethoscope className="size-6" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-xl font-semibold",
            inverted ? "text-white" : "text-foreground"
          )}
        >
          Aaravya
        </span>
        <span
          className={cn(
            "mt-1 font-mono text-xs uppercase tracking-wider",
            inverted ? "text-white/55" : "text-muted-foreground"
          )}
        >
          Hospital
        </span>
      </span>
    </span>
  );
}
