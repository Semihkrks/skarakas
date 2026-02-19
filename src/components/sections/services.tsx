"use client";

import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/scroll-reveal";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Globe,
  Smartphone,
  Palette,
  Server,
  GitBranch,
  MessageSquare,
  ArrowUpRight,
  Layers,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Geliştirme",
    description:
      "React, Next.js ve modern web teknolojileri ile yüksek performanslı, SEO uyumlu web uygulamaları geliştiriyorum.",
    tags: ["Next.js", "React", "TypeScript"],
    gradient: "from-teal-500 to-cyan-500",
    shadowColor: "rgba(20, 184, 166, 0.3)",
    number: "01",
  },
  {
    icon: Smartphone,
    title: "Mobil Uygulama",
    description:
      "React Native ve cross-platform teknolojiler ile iOS ve Android için native deneyim sunan uygulamalar.",
    tags: ["React Native", "Expo", "Mobile"],
    gradient: "from-violet-500 to-purple-500",
    shadowColor: "rgba(139, 92, 246, 0.3)",
    number: "02",
  },
  {
    icon: Palette,
    title: "UI/UX Tasarım",
    description:
      "Kullanıcı odaklı, modern ve estetik arayüz tasarımları. Figma ile prototipleme ve design system oluşturma.",
    tags: ["Figma", "Design System", "Prototype"],
    gradient: "from-amber-500 to-orange-500",
    shadowColor: "rgba(245, 158, 11, 0.3)",
    number: "03",
  },
  {
    icon: Server,
    title: "Backend & API",
    description:
      "Node.js, Python ve Go ile ölçeklenebilir, güvenli RESTful ve GraphQL API'ler geliştiriyorum.",
    tags: ["Node.js", "PostgreSQL", "GraphQL"],
    gradient: "from-emerald-500 to-teal-500",
    shadowColor: "rgba(16, 185, 129, 0.3)",
    number: "04",
  },
  {
    icon: GitBranch,
    title: "DevOps & Cloud",
    description:
      "AWS, Vercel, Docker ile CI/CD pipeline'ları, otomatik deployment ve cloud altyapı yönetimi.",
    tags: ["AWS", "Docker", "CI/CD"],
    gradient: "from-sky-500 to-blue-500",
    shadowColor: "rgba(14, 165, 233, 0.3)",
    number: "05",
  },
  {
    icon: MessageSquare,
    title: "Danışmanlık",
    description:
      "Teknoloji seçimi, mimari tasarım ve proje planlama konularında stratejik danışmanlık hizmeti.",
    tags: ["Strateji", "Mimari", "Planlama"],
    gradient: "from-rose-500 to-pink-500",
    shadowColor: "rgba(244, 63, 94, 0.3)",
    number: "06",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--muted)]/30" />
      <div className="bg-gradient-mesh absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl  bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <Layers className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-4xl font-bold sm:text-5xl">
            Neler <span className="text-gradient">Yapıyorum</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
            Uçtan uca yazılım geliştirme sürecinin her aşamasında profesyonel 
            çözümler sunuyorum.
          </p>
        </ScrollReveal>

        {/* Services Grid — Bento-style */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <StaggerItem key={service.title}>
              <ServiceCard service={service} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${service.shadowColor.replace("0.3", "0.08")}, transparent 60%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative h-full overflow-hidden rounded-3xl glass-card cursor-default"
      whileHover={{ y: -8, transition: { duration: 0.35, ease: "easeOut" } }}
    >
      {/* Mouse-follow spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlightBackground }}
      />

      <div className="relative z-10 p-8">
        {/* Top row: number + arrow */}
        <div className="mb-6 flex items-start justify-between">
          <span className="text-5xl font-black text-[var(--muted-foreground)]/10 leading-none select-none">
            {service.number}
          </span>
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full glass-subtle  text-[var(--muted-foreground)] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:text-white group-hover:shadow-lg"
            style={{ 
              '--tw-shadow-color': service.shadowColor,
            } as React.CSSProperties}
            whileHover={{ rotate: 45 }}
          >
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:scale-110" />
          </motion.div>
        </div>

        {/* Icon */}
        <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl  bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
             style={{ boxShadow: `0 8px 30px ${service.shadowColor}` }}
        >
          <service.icon className="h-7 w-7" />
        </div>

        {/* Content */}
        <h3 className="mb-3 text-xl font-bold tracking-tight">
          {service.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {service.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--muted)] px-3 py-1.5 text-xs font-medium  text-[var(--muted-foreground)] transition-colors group-hover:bg-primary-500/10 group-hover:text-primary-600  dark:group-hover:text-primary-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom decorative gradient line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient}  opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
    </motion.div>
  );
}
