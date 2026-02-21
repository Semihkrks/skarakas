import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminMobileHeader } from "./admin-mobile-header";
import { SidebarProvider } from "./admin-sidebar-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin Panel", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar user={session.user} />
        <div className="flex flex-1 flex-col">
          <AdminMobileHeader />
          <main className="flex-1 overflow-y-auto bg-[var(--background)]">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
