"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/scroll-reveal";
import { TiltCard } from "@/components/animations/tilt-card";
import { ExternalLink, Github, ArrowRight, Award, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

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

// Demo projects shown when database is empty
const demoProjects: Project[] = [
  {
    id: "demo-1",
    title: "E-Ticaret Platformu",
    description: "Next.js ve Supabase ile geliştirilen modern, yüksek performanslı full-stack e-ticaret uygulaması. Gerçek zamanlı stok takibi ve ödeme entegrasyonu.",
    category: "Web",
    tags: ["Next.js", "Supabase", "Stripe", "Tailwind"],
    thumbnail_url: null,
    gradient: "from-teal-500 to-cyan-500",
    live_url: "#",
    github_url: "#",
    featured: true,
  },
  {
    id: "demo-2",
    title: "Görev Yönetim Uygulaması",
    description: "React Native ile geliştirilen cross-platform mobil uygulama. Sürükle-bırak, gerçek zamanlı senkronizasyon ve offline destek.",
    category: "Mobil",
    tags: ["React Native", "Expo", "Firebase"],
    thumbnail_url: null,
    gradient: "from-violet-500 to-purple-500",
    live_url: "#",
    github_url: "#",
    featured: false,
  },
  {
    id: "demo-3",
    title: "RESTful Mikroservis API",
    description: "Node.js ve PostgreSQL ile ölçeklenebilir mikroservis mimarisi. JWT kimlik doğrulama, rate limiting ve Swagger dokümantasyonu.",
    category: "API",
    tags: ["Node.js", "PostgreSQL", "Docker", "Redis"],
    thumbnail_url: null,
    gradient: "from-emerald-500 to-teal-500",
    live_url: null,
    github_url: "#",
    featured: false,
  },
  {
    id: "demo-4",
    title: "SaaS Dashboard",
    description: "Analitik ve veri görselleştirme odaklı yönetim paneli. Gerçek zamanlı grafikler, raporlama ve kullanıcı yönetimi.",
    category: "Web",
    tags: ["React", "TypeScript", "Recharts", "Tailwind"],
    thumbnail_url: null,
    gradient: "from-blue-500 to-indigo-500",
    live_url: "#",
    github_url: "#",
    featured: true,
  },
  {
    id: "demo-5",
    title: "Tasarım Sistemi",
    description: "Kapsamlı UI komponent kütüphanesi. Erişilebilirlik standartlarına uygun, tema desteği ve Storybook dokümantasyonu.",
    category: "UI/UX",
    tags: ["Figma", "Storybook", "React", "A11y"],
    thumbnail_url: null,
    gradient: "from-amber-500 to-orange-500",
    live_url: "#",
    github_url: null,
    featured: false,
  },
  {
    id: "demo-6",
    title: "Gerçek Zamanlı Chat",
    description: "WebSocket tabanlı anlık mesajlaşma uygulaması. Dosya paylaşımı, grup sohbetleri ve uçtan uca şifreleme.",
    category: "Web",
    tags: ["Next.js", "Socket.io", "Redis", "S3"],
    thumbnail_url: null,
    gradient: "from-rose-500 to-pink-500",
    live_url: "#",
    github_url: "#",
    featured: false,
  },
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("projects")
          .select("id, title, description, category, tags, thumbnail_url, gradient, live_url, github_url, featured")
          .order("sort_order", { ascending: true });
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(demoProjects);
          setUsingDemo(true);
        }
      } catch {
        setProjects(demoProjects);
        setUsingDemo(true);
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl">
                <div className="h-52 w-full animate-pulse bg-[var(--muted)]" />
                <div className="space-y-3 p-6">
                  <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--muted)]" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--muted)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    <div className={`relative h-52 w-full overflow-hidden ${!project.thumbnail_url ? `bg-gradient-to-br ${project.gradient}` : ""}`}>
                      {project.thumbnail_url ? (
                        <Image
                          src={project.thumbnail_url}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl font-black text-white/20">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                          {/* Decorative grid pattern */}
                          <div
                            className="absolute inset-0 opacity-10"
                            style={{
                              backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                              backgroundSize: "30px 30px",
                            }}
                          />
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-4  bg-black/50 opacity-0 backdrop-blur-sm  transition-all duration-300 group-hover:opacity-100">
                        {project.live_url && project.live_url !== "#" && (
                          <motion.a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-12 w-12 items-center justify-center rounded-full  bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ExternalLink className="h-5 w-5" />
                          </motion.a>
                        )}
                        {project.github_url && project.github_url !== "#" && (
                          <motion.a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-12 w-12 items-center justify-center rounded-full  bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Github className="h-5 w-5" />
                          </motion.a>
                        )}
                        {usingDemo && (
                          <div className="flex h-12 items-center justify-center rounded-full bg-white/20 px-4 text-sm text-white backdrop-blur-sm">
                            Demo Proje
                          </div>
                        )}
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
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-full glass px-8 py-4 text-base  font-semibold transition-all hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Proje İçin İletişime Geç
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
}
