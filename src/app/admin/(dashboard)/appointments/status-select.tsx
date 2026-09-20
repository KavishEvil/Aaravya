"use client";

import { useTransition } from "react";
import type { AppointmentStatus } from "@/generated/prisma";
import { updateAppointmentStatus } from "./actions";

const STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  PENDING: "border-amber-200 bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
  CONFIRMED: "border-blue-200 bg-[var(--status-info-bg)] text-[var(--status-info-text)]",
  COMPLETED: "border-green-200 bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
  CANCELLED: "border-red-200 bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
};

export function StatusSelect({ id, status }: { id: string; status: AppointmentStatus }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => updateAppointmentStatus(id, e.target.value as AppointmentStatus))
      }
      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize outline-none transition-opacity disabled:opacity-50 ${STATUS_STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
