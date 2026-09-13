import { auth } from "@/auth";
import { AdminSidebar } from "./admin-sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar adminName={session?.user?.email ?? "Admin"} />
      <main className="flex-1 overflow-x-hidden bg-muted/20 p-8">{children}</main>
    </div>
  );
}
