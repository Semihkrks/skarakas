"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./admin-sidebar-context";

export function AdminMobileHeader() {
  const { toggle } = useSidebar();

  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 lg:hidden">
      <button
        onClick={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[var(--muted)] transition-colors"
        aria-label="Menüyü aç/kapat"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
          SK
        </div>
        <span className="text-sm font-semibold">Admin Panel</span>
      </div>
    </div>
  );
}
