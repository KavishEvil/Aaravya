"use client";

import { useTransition } from "react";
import type { AppointmentStatus } from "@/generated/prisma";
import { updateAppointmentStatus } from "./actions";

const STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export function StatusSelect({ id, status }: { id: string; status: AppointmentStatus }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => updateAppointmentStatus(id, e.target.value as AppointmentStatus))
      }
      className="rounded-md border border-input bg-background px-2 py-1 text-xs disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
