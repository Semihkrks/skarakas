"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/scroll-reveal";
import { SpotlightCard } from "@/components/animations/tilt-card";
import { Calendar, Clock, ArrowRight, BookOpen, Search } from "lucide-react";
import Link from "next/link";

export interface BlogListPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  reading_time: string;
  gradient: string | null;
}

const FALLBACK_GRADIENT = "from-teal-500 to-cyan-500";

export function BlogPageContent({ posts }: { posts: BlogListPost[] }) {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Tümü", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === "Tümü" || post.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Page Header */}
      <ScrollReveal className="mb-16 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="text-gradient">Blog</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
          Yazılım geliştirme, tasarım ve teknoloji hakkında deneyimlerimi paylaşıyorum.
        </p>
      </ScrollReveal>

      {/* Search & Filter */}
      <ScrollReveal className="mb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Yazılarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]  pl-11 pr-4 py-3 text-sm focus:border-primary-500 focus:outline-none  focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${ activeCategory === cat ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25" : "glass-subtle text-[var(--muted-foreground)] hover:text-[var(--foreground)]" }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Posts Grid */}
      <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <SpotlightCard className="h-full">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <article className="glass-card group h-full overflow-hidden rounded-2xl transition-all">
                    <div className={`relative h-48 w-full bg-gradient-to-br ${post.gradient || FALLBACK_GRADIENT}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white/20" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString("tr-TR", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.reading_time}
                        </span>
                      </div>
                      <h2 className="mb-3 text-lg font-bold leading-snug transition-colors group-hover:text-primary-500 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="mb-4 text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-500 transition-all group-hover:gap-2">
                        Devamını Oku
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              </SpotlightCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-[var(--muted-foreground)]">
            {posts.length === 0
              ? "Henüz yazı yayınlanmadı. Yakında burada!"
              : "Aramanızla eşleşen yazı bulunamadı."}
          </p>
        </div>
      )}
    </div>
  );
}
