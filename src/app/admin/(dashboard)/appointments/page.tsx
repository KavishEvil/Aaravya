import Link from "next/link";
import { Video, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { AppointmentStatus, AppointmentType } from "@/generated/prisma";
import { AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusSelect } from "./status-select";
import { deleteAppointment } from "./actions";

const STATUS_FILTERS: (AppointmentStatus | "ALL")[] = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const { status, type } = await searchParams;

  const appointments = await prisma.appointment.findMany({
    where: {
      status: status && status !== "ALL" ? (status as AppointmentStatus) : undefined,
      type: type ? (type as AppointmentType) : undefined,
    },
    include: { condition: true, doctor: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Appointments</h1>
      <p className="mt-1 text-sm text-muted-foreground">Requests from the booking form and anonymous consultation funnel.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/appointments" : `/admin/appointments?status=${s}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              (status ?? "ALL") === s
                ? "border-primary bg-accent text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <AdminTable
        columns={["Patient", "Contact", "Type", "Condition / Doctor", "Status", "Received", ""]}
        rows={appointments.map((a) => [
          <div key="name">
            <p className="font-medium text-foreground">{a.isAnonymous ? a.nickname ?? "Anonymous" : a.name ?? "—"}</p>
            {a.isAnonymous && (
              <span className="mt-0.5 inline-block rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
                {a.anonymousCategory}
              </span>
            )}
          </div>,
          <div key="contact" className="text-xs text-muted-foreground">
            <p>{a.phone}</p>
            {a.email && <p>{a.email}</p>}
          </div>,
          <span key="type" className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
            {a.type === "IN_CLINIC" ? (
              <Building2 className="size-3.5 text-muted-foreground" />
            ) : (
              <Video className="size-3.5 text-muted-foreground" />
            )}
            {a.type === "IN_CLINIC" ? "In-Clinic" : "Teleconsult"}
          </span>,
          <div key="rel" className="text-xs text-muted-foreground">
            {a.condition && <p>{a.condition.name}</p>}
            {a.doctor && <p>{a.doctor.name}</p>}
          </div>,
          <StatusSelect key="status" id={a.id} status={a.status} />,
          <span key="date" className="text-xs text-muted-foreground">
            {a.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>,
          <div key="actions" className="flex justify-end">
            <DeleteButton action={deleteAppointment.bind(null, a.id)} confirmText="Delete this appointment record?" />
          </div>,
        ])}
      />
    </div>
  );
}
