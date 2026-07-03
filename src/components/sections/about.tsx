"use client";

import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { TiltCard } from "@/components/animations/tilt-card";
import { 
  Code2, Palette, Database, Cloud, Layers, Cpu, 
  Rocket, Award, Users, TrendingUp, Zap, Terminal,
  Briefcase, GraduationCap
} from "lucide-react";

const skills = [
  { name: "React / Next.js", level: 95, icon: Code2, color: "from-teal-400 to-cyan-500" },
  { name: "TypeScript", level: 92, icon: Layers, color: "from-blue-400 to-indigo-500" },
  { name: "UI/UX Design", level: 88, icon: Palette, color: "from-violet-400 to-purple-500" },
  { name: "Node.js / Backend", level: 90, icon: Database, color: "from-emerald-400 to-teal-500" },
  { name: "Cloud & DevOps", level: 82, icon: Cloud, color: "from-sky-400 to-blue-500" },
  { name: "System Design", level: 85, icon: Cpu, color: "from-amber-400 to-orange-500" },
];

const stats = [
  { 
    value: "5+", 
    label: "Yıl Deneyim", 
    icon: Briefcase,
    description: "Profesyonel yazılım geliştirme",
    gradient: "from-teal-500 to-emerald-500",
  },
  { 
    value: "50+", 
    label: "Tamamlanan Proje", 
    icon: Rocket,
    description: "Başarıyla teslim edilen çözümler",
    gradient: "from-blue-500 to-violet-500",
  },
  { 
    value: "30+", 
    label: "Mutlu Müşteri", 
    icon: Users,
    description: "Dünya genelinde işbirliği",
    gradient: "from-amber-500 to-orange-500",
  },
  { 
    value: "99%", 
    label: "Memnuniyet", 
    icon: Award,
    description: "Müşteri memnuniyet oranı",
    gradient: "from-rose-500 to-pink-500",
  },
];

const timeline = [
  { year: "2021", title: "Kariyer Başlangıcı", icon: GraduationCap },
  { year: "2023", title: "Senior Developer", icon: TrendingUp },
  { year: "2025", title: "Tech Lead", icon: Zap },
  { year: "2026", title: "Freelance & Stüdyo", icon: Terminal },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="bg-gradient-mesh absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <Code2 className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-4xl font-bold sm:text-5xl">
            Ben <span className="text-gradient">Semih Karakaş</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
            Tutkulu bir yazılım geliştirici olarak modern teknolojilerle 
            fark yaratan dijital deneyimler oluşturuyorum.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          {/* Left — Profile Image with Tilt */}
          <ScrollReveal direction="left">
            <TiltCard className="group mx-auto max-w-md">
              <div className="relative overflow-hidden rounded-3xl glass-card p-2">
                {/* Placeholder image — gradient avatar */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-emerald-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="h-48 w-48 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-6xl font-bold">
                        SK
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 blur-2xl opacity-40" />
                    </div>
                  </div>

                  {/* Floating badges — icons instead of emojis */}
                  <motion.div
                    className="absolute top-6 right-6 glass-subtle rounded-2xl px-4 py-2 text-sm font-medium flex items-center gap-2"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Terminal className="h-4 w-4 text-primary-500" />
                    Full-Stack Dev
                  </motion.div>
                  <motion.div
                    className="absolute bottom-6 left-6 glass-subtle rounded-2xl px-4 py-2 text-sm font-medium flex items-center gap-2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <Palette className="h-4 w-4 text-accent-500" />
                    UI/UX Designer
                  </motion.div>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>

          {/* Right — Bio & Skills */}
          <div>
            <ScrollReveal direction="right">
              <div className="mb-10">
                <h3 className="mb-4 text-2xl font-bold">
                  Dijital dünyada <span className="text-gradient">iz bırakmak</span> için buradayım
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  5 yılı aşkın profesyonel deneyimimle, performans odaklı ve görsel açıdan
                  etkileyici web uygulamaları tasarlıyorum. React, Next.js, TypeScript ve
                  modern backend teknolojileriyle uçtan uca çözümler sunuyorum.
                </p>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Her projede temiz kod, ölçeklenebilir mimari ve mükemmel kullanıcı deneyimi 
                  önceliğimdir. Sürekli öğrenen ve gelişen bir yaklaşımla, müşterilerime 
                  en güncel teknolojileri sunuyorum.
                </p>
              </div>
            </ScrollReveal>

            {/* Skills — Redesigned */}
            <div className="space-y-4">
              {skills.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Row */}
        <ScrollReveal className="mt-24 mb-8">
          <div className="relative mx-auto max-w-3xl">
            {/* Line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
            
            <div className="relative grid grid-cols-4 gap-4">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl glass-card bg-[var(--background)] text-primary-500 relative z-10">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-gradient">{item.year}</span>
                  <span className="mt-1 text-xs text-[var(--muted-foreground)] leading-tight">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Row — Premium Redesign */}
        <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <StatCard stat={stat} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Premium Stat Card */
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const gradientX = useTransform(mouseX, (v) => `${v}px`);
  const gradientY = useTransform(mouseY, (v) => `${v}px`);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-3xl glass-card p-6 text-center cursor-default"
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {/* Mouse-follow glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [gradientX, gradientY],
            ([x, y]) => `radial-gradient(300px circle at ${x} ${y}, rgba(20, 184, 166, 0.12), transparent 60%)`
          ),
        }}
      />

      {/* Icon */}
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl  bg-gradient-to-br ${stat.gradient} shadow-lg`}
           style={{ boxShadow: `0 8px 30px rgba(20,184,166,0.2)` }}
      >
        <stat.icon className="h-6 w-6 text-white" />
      </div>

      {/* Counter */}
      <div className="text-4xl font-black tracking-tight sm:text-5xl">
        <CountUp target={stat.value} delay={0.3 + index * 0.12} />
      </div>

      {/* Label */}
      <p className="mt-2 text-sm font-semibold">{stat.label}</p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{stat.description}</p>

      {/* Decorative corner accent */}
      <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.07] blur-2xl  transition-opacity group-hover:opacity-[0.15]`} />
    </motion.div>
  );
}

/* Animated Skill Bar — Redesigned */
function SkillBar({
  skill,
  delay,
}: {
  skill: (typeof skills)[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <ScrollReveal delay={delay}>
      <div ref={ref} className="group">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${skill.color}  shadow-sm`}>
              <skill.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">{skill.name}</span>
          </div>
          <motion.span
            className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-bold tabular-nums"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: delay + 0.3 }}
          >
            {skill.level}%
          </motion.span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${skill.color} relative`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* Animated Count Up */
function CountUp({ target, delay = 0 }: { target: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract number and suffix
  const match = target.match(/^(\d+)(.*)$/);
  const num = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : target;

  return (
    <div ref={ref} className="text-gradient inline-block">
      {/* Static value for crawlers/screen readers — animated ticker overwrites
          its own DOM mid-count, so bots can snapshot a low number otherwise */}
      <span className="sr-only">{target}</span>
      <span aria-hidden="true">
        <NumberTicker value={num} suffix={suffix} delay={delay} animate={isInView} />
      </span>
    </div>
  );
}

function NumberTicker({ value, suffix, delay, animate }: { value: number; suffix: string; delay: number; animate: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || hasAnimated.current || !ref.current) return;
    hasAnimated.current = true;

    const timeout = setTimeout(() => {
      let start = 0;
      const end = value;
      const duration = 1800;
      const stepTime = Math.max(Math.floor(duration / end), 20);
      const timer = setInterval(() => {
        start += 1;
        if (ref.current) ref.current.textContent = start + suffix;
        if (start >= end) clearInterval(timer);
      }, stepTime);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [animate, value, suffix, delay]);

  return (
    <span ref={ref}>
      {value}{suffix}
    </span>
  );
}
