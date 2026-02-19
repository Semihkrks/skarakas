"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/scroll-reveal";
import { SpotlightCard } from "@/components/animations/tilt-card";
import { Calendar, Clock, ArrowRight, BookOpen, PenTool, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  reading_time: string;
  gradient: string;
}

export function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("blog_posts")
          .select("id, slug, title, excerpt, category, created_at, reading_time, gradient")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(3);
        if (data) setBlogPosts(data);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);
  return (
    <section id="blog" className="relative py-32 overflow-hidden">
      <div className="bg-gradient-mesh absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl  bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <PenTool className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-4xl font-bold sm:text-5xl">
            Son <span className="text-gradient">Yazılarım</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
            Yazılım geliştirme, tasarım ve teknoloji hakkında deneyimlerimi 
            ve öğrendiklerimi paylaşıyorum.
          </p>
        </ScrollReveal>

        {/* Blog Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted-foreground)]">Henüz blog yazısı yok.</div>
        ) : (
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <StaggerItem key={post.id}>
              <SpotlightCard className="h-full">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <article className="glass-card group h-full overflow-hidden rounded-2xl transition-all">
                    {/* Cover Gradient */}
                    <div className={`relative h-48 w-full bg-gradient-to-br ${post.gradient} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white/20" />
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta */}
                      <div className="mb-3 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.reading_time}
                        </span>
                      </div>

                      <h3 className="mb-3 text-lg font-bold leading-snug transition-colors group-hover:text-primary-500 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mb-4 text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Read More */}
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-500  transition-all group-hover:gap-2">
                        Devamını Oku
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
        )}

        {/* View All CTA */}
        <ScrollReveal className="mt-16 text-center">
          <motion.div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full glass px-8 py-4 text-base  font-semibold transition-all hover:shadow-lg"
            >
              Tüm Yazıları Gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
