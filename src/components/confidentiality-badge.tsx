import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfidentialityBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground",
        className
      )}
    >
      <ShieldCheck className="size-3.5 text-brand" />
      Your consult is confidential — nothing is recorded without your consent
    </span>
  );
}
