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

    const [blogRes, projectsRes, messagesRes, unreadRes] = await Promise.all([
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
    ]);

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
    });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
