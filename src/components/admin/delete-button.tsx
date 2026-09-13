"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({ action, confirmText }: { action: () => Promise<void>; confirmText?: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmText ?? "Delete this item? This cannot be undone.")) {
          startTransition(() => action());
        }
      }}
      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      aria-label="Delete"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
