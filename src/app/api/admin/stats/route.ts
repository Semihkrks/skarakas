import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const supabase = await createClient();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Existing counts + visitor counts in parallel
    const [
      blogRes,
      projectsRes,
      messagesRes,
      unreadRes,
      viewsTotalRes,
      viewsTodayRes,
      viewsWeekRes,
      viewsMonthRes,
    ] = await Promise.all([
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
      supabase.from("page_views").select("id", { count: "exact", head: true }),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", monthAgo),
    ]);

    // Daily views for chart (last 14 days)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentViews } = await supabase
      .from("page_views")
      .select("created_at")
      .gte("created_at", fourteenDaysAgo)
      .order("created_at", { ascending: true });

    // Aggregate by date
    const dailyMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = 0;
    }
    recentViews?.forEach((v) => {
      const key = v.created_at.slice(0, 10);
      if (dailyMap[key] !== undefined) {
        dailyMap[key]++;
      }
    });
    const dailyData = Object.entries(dailyMap).map(([date, views]) => ({ date, views }));

    // Top pages
    const { data: allViews } = await supabase
      .from("page_views")
      .select("path")
      .gte("created_at", monthAgo);

    const pageMap: Record<string, number> = {};
    allViews?.forEach((v) => {
      pageMap[v.path] = (pageMap[v.path] || 0) + 1;
    });
    const topPages = Object.entries(pageMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([path, views]) => ({ path, views }));

    // Son aktiviteler
    const [recentPosts, recentMessages, recentProjects] = await Promise.all([
      supabase.from("blog_posts").select("title, status, created_at").order("created_at", { ascending: false }).limit(3),
      supabase.from("messages").select("name, created_at").order("created_at", { ascending: false }).limit(3),
      supabase.from("projects").select("title, created_at").order("created_at", { ascending: false }).limit(2),
    ]);

    const activities: { type: string; text: string; time: string }[] = [];

    recentPosts.data?.forEach((p) => {
      activities.push({
        type: "blog",
        text: `"${p.title}" ${p.status === "published" ? "yayınlandı" : "taslak olarak oluşturuldu"}`,
        time: p.created_at,
      });
    });

    recentMessages.data?.forEach((m) => {
      activities.push({
        type: "message",
        text: `Yeni iletişim mesajı: ${m.name}`,
        time: m.created_at,
      });
    });

    recentProjects.data?.forEach((p) => {
      activities.push({
        type: "project",
        text: `"${p.title}" projesi eklendi`,
        time: p.created_at,
      });
    });

    // Tarihe göre sırala
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      blogCount: blogRes.count || 0,
      projectsCount: projectsRes.count || 0,
      messagesCount: messagesRes.count || 0,
      unreadCount: unreadRes.count || 0,
      recentActivity: activities.slice(0, 5),
      visitors: {
        total: viewsTotalRes.count || 0,
        today: viewsTodayRes.count || 0,
        thisWeek: viewsWeekRes.count || 0,
        thisMonth: viewsMonthRes.count || 0,
        dailyData,
        topPages,
      },
    });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
