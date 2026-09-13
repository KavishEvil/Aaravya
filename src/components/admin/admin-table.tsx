import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminListHeader({ title, newHref, newLabel }: { title: string; newHref?: string; newLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-heading text-2xl font-semibold">{title}</h1>
      {newHref && (
        <Button size="sm" render={<Link href={newHref} />} className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1 size-4" /> {newLabel ?? "New"}
        </Button>
      )}
    </div>
  );
}

export function AdminTable({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-medium whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                Nothing here yet.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 align-middle">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
