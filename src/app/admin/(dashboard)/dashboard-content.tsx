"use client";

import { motion } from "framer-motion";
import { FileText, FolderKanban, MessageSquare, Eye, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface DashboardStats {
  blogCount: number;
  projectsCount: number;
  messagesCount: number;
  unreadCount: number;
  recentActivity: { type: string; text: string; time: string }[];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
  return date.toLocaleDateString("tr-TR");
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const stats = [
    { label: "Blog Yazıları", value: String(data.blogCount), change: `${data.blogCount} yazı`, icon: FileText, href: "/admin/blog", gradient: "from-blue-500 to-indigo-500" },
    { label: "Projeler", value: String(data.projectsCount), change: `${data.projectsCount} proje`, icon: FolderKanban, href: "/admin/projects", gradient: "from-teal-500 to-cyan-500" },
    { label: "Mesajlar", value: String(data.messagesCount), change: data.unreadCount > 0 ? `${data.unreadCount} okunmadı` : "Tümü okundu", icon: MessageSquare, href: "/admin/messages", gradient: "from-amber-500 to-orange-500" },
    { label: "Okunmamış", value: String(data.unreadCount), change: "mesaj bekliyor", icon: Eye, href: "/admin/messages", gradient: "from-purple-500 to-pink-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">skarakas.com yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={stat.href}>
              <div className="glass-card group rounded-2xl p-6 transition-all hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:opacity-100" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <div className="mt-1 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <p className="text-xs text-[var(--muted-foreground)]">{stat.change}</p>
                </div>
                <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="mb-6 text-lg font-bold">Son Aktiviteler</h2>
          <div className="space-y-4">
            {data.recentActivity.length > 0 ? data.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--muted)]">
                <div className={`mt-1 h-2 w-2 rounded-full ${activity.type === "blog" ? "bg-blue-500" : activity.type === "message" ? "bg-amber-500" : "bg-teal-500"}`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{timeAgo(activity.time)}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[var(--muted-foreground)]">Henüz aktivite yok.</p>
            )}
          </div>
        </motion.div>

        <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="mb-6 text-lg font-bold">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/admin/blog" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-all hover:border-primary-500 hover:bg-primary-500/5">
              <FileText className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Yeni Blog Yazısı</span>
            </Link>
            <Link href="/admin/projects" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-all hover:border-primary-500 hover:bg-primary-500/5">
              <FolderKanban className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Yeni Proje Ekle</span>
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-all hover:border-primary-500 hover:bg-primary-500/5">
              <MessageSquare className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Mesajları Gör</span>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-all hover:border-primary-500 hover:bg-primary-500/5">
              <Eye className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Siteyi Görüntüle</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
