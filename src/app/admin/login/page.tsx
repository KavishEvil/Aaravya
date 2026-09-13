"use client";

import { useActionState } from "react";
import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--sidebar)] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-card p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Stethoscope className="size-5" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold">Aaravya Admin</p>
            <p className="text-xs text-muted-foreground">Staff sign-in</p>
          </div>
        </div>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-destructive/10 p-2.5 text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="mt-1 bg-brand text-brand-foreground hover:bg-brand/90">
            {pending ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
