import Link from "next/link";
import { Label } from "@/components/ui/label";

export const ADMIN_INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function AdminFormShell({
  title,
  backHref,
  children,
}: {
  title: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-semibold">{title}</h1>
      <div className="mt-6 max-w-2xl">{children}</div>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {htmlFor ? <Label htmlFor={htmlFor}>{label}</Label> : <Label>{label}</Label>}
      {children}
      {help && <p className="mt-1 text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}
