"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/scroll-reveal";
import { TiltCard } from "@/components/animations/tilt-card";
import { ExternalLink, Github, ArrowRight, Award, FolderOpen, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  gradient: string;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
}

const categories = ["Tümü", "Web", "Mobil", "API", "UI/UX"];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("projects")
          .select("id, title, description, category, tags, thumbnail_url, gradient, live_url, github_url, featured")
          .order("sort_order", { ascending: true });
        if (data) setProjects(data);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects =
    activeCategory === "Tümü"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="bg-gradient-mesh absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl  bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <FolderOpen className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-4xl font-bold sm:text-5xl">
            Seçkin <span className="text-gradient">Çalışmalarım</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
            Son dönemde geliştirdiğim projelerin bir kısmı. Her biri benzersiz 
            bir problem çözümü ve teknoloji deneyimi sunar.
          </p>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal className="mb-12 flex items-center justify-center">
          <div className="inline-flex gap-2 rounded-full glass-subtle p-1.5">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${ activeCategory === cat ? "text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]" }`}
                whileTap={{ scale: 0.95 }}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted-foreground)]">Henüz proje yok.</div>
        ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TiltCard className="group h-full" tiltAmount={6}>
                  <div className="glass-card h-full overflow-hidden rounded-2xl">
                    {/* Image / Gradient Placeholder */}
                    <div className={`relative h-52 w-full bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/30">
                          {project.title.charAt(0)}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-4  bg-black/50 opacity-0 backdrop-blur-sm  transition-all duration-300 group-hover:opacity-100">
                        <motion.a
                          href={project.live_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-12 w-12 items-center justify-center rounded-full  bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </motion.a>
                        <motion.a
                          href={project.github_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-12 w-12 items-center justify-center rounded-full  bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="h-5 w-5" />
                        </motion.a>
                      </div>

                      {/* Featured badge */}
                      {project.featured && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5  text-xs font-medium text-white backdrop-blur-sm">
                          <Award className="h-3.5 w-3.5" />
                          Öne Çıkan
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-primary-500">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="mb-2 text-lg font-bold group-hover:text-gradient transition-all">
                        {project.title}
                      </h3>
                      <p className="mb-4 text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs  text-[var(--muted-foreground)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {/* View All CTA */}
        <ScrollReveal className="mt-16 text-center">
          <motion.a
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full glass px-8 py-4 text-base  font-semibold transition-all hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Tüm Projeleri Gör
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
}
