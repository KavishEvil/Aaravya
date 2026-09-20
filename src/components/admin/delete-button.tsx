"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteButton({ action, confirmText }: { action: () => Promise<void>; confirmText?: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      title="Delete"
      onClick={() => {
        if (confirm(confirmText ?? "Delete this item? This cannot be undone.")) {
          startTransition(() => action());
        }
      }}
      className="flex size-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      aria-label="Delete"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
