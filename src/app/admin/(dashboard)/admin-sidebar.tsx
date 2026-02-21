"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  ArrowLeft,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import type { User } from "next-auth";
import { useSidebar } from "./admin-sidebar-context";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blog Yazıları", href: "/admin/blog", icon: FileText },
  { label: "Projeler", href: "/admin/projects", icon: FolderKanban },
  { label: "Mesajlar", href: "/admin/messages", icon: MessageSquare },
  { label: "Ayarlar", href: "/admin/settings", icon: Settings },
];

function SidebarContent({ user, unreadCount }: { user: User; unreadCount: number }) {
  const pathname = usePathname();

  return (
    <>
      {/* Brand */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Siteye Dön
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">
            SK
          </div>
          <div>
            <p className="text-sm font-semibold">Admin Panel</p>
            <p className="text-xs text-[var(--muted-foreground)]">skarakas.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-400"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <link.icon
                className={`h-5 w-5 ${isActive ? "text-primary-500" : ""}`}
              />
              {link.label}
              {link.label === "Mesajlar" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {isActive && link.label !== "Mesajlar" && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {isActive && link.label === "Mesajlar" && unreadCount === 0 && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-[var(--border)] pt-4">
        <div className="mb-3 flex items-center gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Admin"}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-bold">
              {(user.name || "A").charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [unreadCount, setUnreadCount] = useState(0);

  // Close sidebar on navigation
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Fetch unread message count
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.unreadCount || 0))
      .catch(() => {});
  }, [pathname]);

  return (
    <>
      {/* Desktop sidebar - always visible */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--card)] p-6 lg:flex">
        <SidebarContent user={user} unreadCount={unreadCount} />
      </aside>

      {/* Mobile sidebar - drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            {/* Drawer */}
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--card)] p-6 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close button */}
              <button
                onClick={close}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                aria-label="Menüyü kapat"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent user={user} unreadCount={unreadCount} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
