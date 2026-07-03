"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  content: string;
}

/* Render **bold** and `code` inline markdown as real elements */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--foreground)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const articleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r  from-primary-500 to-accent-500"
        style={{ scaleX }}
      />

      <div ref={articleRef} className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {/* Back Link */}
        <ScrollReveal>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]  transition-colors hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Yazılar
          </Link>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal>
          <header className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-3 py-1  text-xs font-medium text-primary-600 dark:text-primary-400">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
            </div>
            <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} okuma
              </span>
            </div>
          </header>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal>
          <article className="prose prose-lg dark:prose-invert max-w-none  prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-strong:text-[var(--foreground)] prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline prose-li:text-[var(--muted-foreground)] prose-code:rounded prose-code:bg-[var(--muted)] prose-code:px-1.5 prose-code:py-0.5">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-xl font-bold mt-8 mb-3 text-[var(--foreground)]">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-12 mb-4 text-[var(--foreground)]">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="my-4 list-disc space-y-2 pl-6">
                    {items.map((item, j) => (
                      <li key={j} className="text-[var(--muted-foreground)]">
                        {renderInline(item.replace("- ", ""))}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="mb-4 text-[var(--muted-foreground)] leading-relaxed">
                  {renderInline(paragraph)}
                </p>
              );
            })}
          </article>
        </ScrollReveal>

        {/* Navigation */}
        <ScrollReveal className="mt-16">
          <div className="border-t border-[var(--border)] pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm  font-semibold transition-all hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Tüm Yazılara Dön
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}
