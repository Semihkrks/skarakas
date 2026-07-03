import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BlogPageContent } from "./blog-content";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Yazılım geliştirme, tasarım ve teknoloji hakkında yazılar.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, created_at, reading_time, gradient")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <BlogPageContent posts={posts ?? []} />
      </main>
      <Footer />
    </>
  );
}
