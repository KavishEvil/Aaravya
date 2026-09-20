"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

/**
 * Drop-in replacement for a plain submit `<Button>` inside an admin
 * `<form action={serverAction}>`. `useFormStatus` reads pending state from
 * the nearest parent form, so this needs no props or state wiring from the
 * page — it just has to render somewhere inside that form.
 *
 * Doubles as upload-progress feedback for forms using `ImageUploadField`:
 * the browser doesn't expose real byte-level progress for a `<form
 * action={...}>` submission, but disabling the button and showing a spinner
 * for the whole "uploading + saving" window is enough to prevent a
 * double-submit and tell the admin something is happening.
 */
export function AdminSubmitButton({
  children,
  pendingText = "Saving…",
  ...props
}: React.ComponentProps<typeof Button> & { pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
