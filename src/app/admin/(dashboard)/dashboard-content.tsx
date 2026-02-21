"use client";

import { motion } from "framer-motion";
import {
  FileText,
  FolderKanban,
  MessageSquare,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Users,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VisitorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  dailyData: { date: string; views: number }[];
  topPages: { path: string; views: number }[];
}

interface DashboardStats {
  blogCount: number;
  projectsCount: number;
  messagesCount: number;
  unreadCount: number;
  recentActivity: { type: string; text: string; time: string }[];
  visitors: VisitorStats;
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

function formatPageName(path: string): string {
  if (path === "/") return "Ana Sayfa";
  if (path.startsWith("/blog/")) return `Blog: ${path.replace("/blog/", "")}`;
  if (path === "/blog") return "Blog";
  return path;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-lg">
        <p className="text-xs text-[var(--muted-foreground)]">
          {new Date(label).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
          })}
        </p>
        <p className="text-sm font-bold">{payload[0].value} görüntülenme</p>
      </div>
    );
  }
  return null;
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
      <div>
        <div className="mb-8">
          <div className="h-9 w-48 animate-pulse rounded-xl bg-[var(--muted)]" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl bg-[var(--muted)]"
            />
          ))}
        </div>
        <div className="mb-8 h-80 animate-pulse rounded-2xl bg-[var(--muted)]" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-[var(--muted)]" />
          <div className="h-64 animate-pulse rounded-2xl bg-[var(--muted)]" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Blog Yazıları",
      value: String(data.blogCount),
      change: `${data.blogCount} yazı`,
      icon: FileText,
      href: "/admin/blog",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      label: "Projeler",
      value: String(data.projectsCount),
      change: `${data.projectsCount} proje`,
      icon: FolderKanban,
      href: "/admin/projects",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      label: "Mesajlar",
      value: String(data.messagesCount),
      change:
        data.unreadCount > 0
          ? `${data.unreadCount} okunmadı`
          : "Tümü okundu",
      icon: MessageSquare,
      href: "/admin/messages",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Ziyaretçiler",
      value: String(data.visitors.thisMonth),
      change: `Bugün ${data.visitors.today}`,
      icon: Users,
      href: "/admin",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const visitorMiniStats = [
    { label: "Bugün", value: data.visitors.today },
    { label: "Bu Hafta", value: data.visitors.thisWeek },
    { label: "Bu Ay", value: data.visitors.thisMonth },
    { label: "Toplam", value: data.visitors.total },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          skarakas.com yönetim paneline hoş geldiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={stat.href}>
              <div className="glass-card group rounded-2xl p-5 transition-all hover:shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:opacity-100" />
                </div>
                <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                <div className="mt-1 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {stat.change}
                  </p>
                </div>
                <p className="mt-1.5 text-sm font-medium text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Visitor Analytics Chart */}
      <motion.div
        className="glass-card mb-8 rounded-2xl p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Eye className="h-5 w-5 text-primary-500" />
              Ziyaretçi İstatistikleri
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Son 14 gün
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {visitorMiniStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-center"
              >
                <p className="text-lg font-bold sm:text-xl">{s.value}</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.visitors.dailyData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="viewsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                  })
                }
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="url(#viewsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Grid: Activity + Top Pages + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          className="glass-card rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-5 text-lg font-bold">Son Aktiviteler</h2>
          <div className="space-y-3">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-[var(--muted)]"
                >
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      activity.type === "blog"
                        ? "bg-blue-500"
                        : activity.type === "message"
                          ? "bg-amber-500"
                          : "bg-teal-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{activity.text}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {timeAgo(activity.time)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">
                Henüz aktivite yok.
              </p>
            )}
          </div>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          className="glass-card rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
            <Globe className="h-5 w-5 text-primary-500" />
            Popüler Sayfalar
          </h2>
          <div className="space-y-3">
            {data.visitors.topPages.length > 0 ? (
              data.visitors.topPages.map((page, i) => (
                <div
                  key={page.path}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[var(--muted)]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-xs font-bold text-primary-500">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {formatPageName(page.path)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[var(--muted-foreground)]">
                    {page.views}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">
                Henüz veri yok.
              </p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="glass-card rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="mb-5 text-lg font-bold">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/admin/blog"
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3.5 transition-all hover:border-primary-500 hover:bg-primary-500/5"
            >
              <FileText className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Yeni Blog Yazısı</span>
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3.5 transition-all hover:border-primary-500 hover:bg-primary-500/5"
            >
              <FolderKanban className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Yeni Proje Ekle</span>
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3.5 transition-all hover:border-primary-500 hover:bg-primary-500/5"
            >
              <MessageSquare className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Mesajları Gör</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3.5 transition-all hover:border-primary-500 hover:bg-primary-500/5"
            >
              <Eye className="h-5 w-5 text-primary-500" />
              <span className="text-sm font-medium">Siteyi Görüntüle</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
