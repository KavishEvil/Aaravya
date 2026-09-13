import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [pending, confirmed, todayCount, anonymousCount, conditionsCount, doctorsCount] =
    await Promise.all([
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "CONFIRMED" } }),
      prisma.appointment.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.appointment.count({ where: { isAnonymous: true } }),
      prisma.condition.count(),
      prisma.doctor.count(),
    ]);

  const stats = [
    { label: "Pending Appointments", value: pending, href: "/admin/appointments?status=PENDING" },
    { label: "Confirmed Appointments", value: confirmed, href: "/admin/appointments?status=CONFIRMED" },
    { label: "New Today", value: todayCount, href: "/admin/appointments" },
    { label: "Anonymous Requests", value: anonymousCount, href: "/admin/appointments" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {conditionsCount} conditions · {doctorsCount} doctors published
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
          >
            <p className="font-heading text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Use the sidebar to manage content — changes go live immediately on the public site.
      </div>
    </div>
  );
}
