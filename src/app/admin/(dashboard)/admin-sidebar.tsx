"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { logoutAction } from "./actions";

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
      <div className="border-b border-white/10 p-5">
        <p className="font-heading text-sm font-semibold">Aaravya Admin</p>
        <p className="mt-0.5 text-xs text-[var(--sidebar-foreground)]/60">{adminName}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
                  : "text-[var(--sidebar-foreground)]/75 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="border-t border-white/10 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--sidebar-foreground)]/75 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
        >
          <LogOut className="size-4" /> Sign Out
        </button>
      </form>
    </aside>
  );
}
