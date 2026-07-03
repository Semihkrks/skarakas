"use client";

import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { ChevronDown, Terminal, Braces, Hash, Database, GitBranch, Cpu, Wifi, ArrowRight, MessageSquare } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ParticleField } from "@/components/animations/particle-field";

// Rotating role texts
const roles = [
  "Full-Stack Developer",
  "UI/UX Designer",
  "Cloud Architect",
  "Problem Solver",
];

// Floating code snippets for background
const codeSnippets = [
  { code: "const app = next();", x: "8%", y: "18%", delay: 0, rotate: -6 },
  { code: "<Component />", x: "82%", y: "22%", delay: 1.5, rotate: 4 },
  { code: "async/await", x: "75%", y: "72%", delay: 3, rotate: -3 },
  { code: "export default", x: "12%", y: "75%", delay: 2, rotate: 8 },
  { code: "npm run build", x: "88%", y: "50%", delay: 4, rotate: -5 },
  { code: "git push origin", x: "5%", y: "48%", delay: 1, rotate: 3 },
];

// Floating tech icons
const floatingIcons = [
  { Icon: Braces, x: "15%", y: "25%", size: 20, delay: 0 },
  { Icon: Hash, x: "80%", y: "30%", size: 18, delay: 1.2 },
  { Icon: Database, x: "70%", y: "68%", size: 22, delay: 2.4 },
  { Icon: GitBranch, x: "20%", y: "70%", size: 16, delay: 0.8 },
  { Icon: Cpu, x: "90%", y: "45%", size: 14, delay: 3 },
  { Icon: Wifi, x: "6%", y: "55%", size: 16, delay: 1.8 },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [roleIndex, setRoleIndex] = useState(0);

  // Mouse-follow glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Multi-color gradient mesh */}
        <div className="absolute inset-0 bg-gradient-mesh" />

        {/* Mouse-follow glow */}
        <motion.div
          className="pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            x: useTransform(mouseX, (v) => v - 300),
            y: useTransform(mouseY, (v) => v - 300),
            background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)",
          }}
        />

        {/* Extra color blobs for richness */}
        <div className="absolute left-[5%] top-[10%] h-80 w-80 animate-blob rounded-full bg-primary-500/25 blur-3xl dark:bg-primary-500/12" />
        <div className="absolute right-[10%] top-[15%] h-96 w-96 animate-blob-delayed rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute bottom-[15%] left-[25%] h-72 w-72 animate-blob rounded-full bg-cyan-500/20 blur-3xl dark:bg-cyan-500/10" style={{ animationDelay: "4s" }} />
        <div className="absolute top-[50%] right-[30%] h-64 w-64 animate-blob-delayed rounded-full bg-amber-500/15 blur-3xl dark:bg-amber-500/8" style={{ animationDelay: "6s" }} />
        <div className="absolute bottom-[30%] right-[5%] h-56 w-56 animate-blob rounded-full bg-rose-500/15 blur-3xl dark:bg-rose-500/8" style={{ animationDelay: "8s" }} />

        {/* Floating code snippets */}
        {codeSnippets.map((snippet, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:block font-mono text-xs text-primary-500/20 dark:text-primary-400/15 select-none pointer-events-none whitespace-nowrap"
            style={{ left: snippet.x, top: snippet.y, rotate: snippet.rotate }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: snippet.delay,
            }}
          >
            {snippet.code}
          </motion.div>
        ))}

        {/* Floating tech icons */}
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:flex text-primary-500/15 dark:text-primary-400/10 select-none pointer-events-none"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + i * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <item.Icon size={item.size} />
          </motion.div>
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Particle System */}
        <ParticleField />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
        style={{ y: textY, opacity }}
      >
        {/* Terminal-style badge */}
        <motion.div
          className="mb-8 inline-flex items-center gap-3 rounded-full glass-subtle px-5 py-2.5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Terminal className="h-4 w-4 text-primary-500" />
          <span className="font-mono text-sm text-[var(--muted-foreground)]">
            ~/skarakas
          </span>
          <span className="h-4 w-px bg-[var(--border)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-500 font-medium">online</span>
        </motion.div>

        {/* Main Title — Staggered word animation */}
        <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <motion.span
            className="block text-gradient"
            initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Semih
          </motion.span>{" "}
          <motion.span
            className="block text-gradient"
            initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Karakaş
          </motion.span>
        </h1>

        {/* Rotating role text */}
        <motion.div
          className="mb-6 h-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              className="text-xl sm:text-2xl md:text-3xl font-light text-[var(--muted-foreground)]"
              initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {roles[roleIndex].split(" ").map((word, i) => (
                <span key={i}>
                  {i === 0 ? (
                    <span className="text-[var(--foreground)] font-semibold">{word}</span>
                  ) : (
                    <span>{" "}{word}</span>
                  )}
                </span>
              ))}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Description */}
        <motion.p
          className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
        >
          Modern web teknolojileri ile yüksek performanslı, estetik ve
          kullanıcı deneyimi odaklı dijital ürünler tasarlıyor ve geliştiriyorum.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7 }}
        >
          <motion.a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-shadow hover:shadow-xl hover:shadow-primary-500/35"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">Projelerimi Gör</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>

          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 rounded-full glass px-8 py-4 text-base font-semibold transition-all hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            İletişime Geç
            <MessageSquare className="h-4 w-4" />
          </motion.a>
        </motion.div>

        {/* Tech stack pills */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.7 }}
        >
          {["Next.js", "TypeScript", "React", "Node.js", "Tailwind", "Supabase"].map((tech, i) => (
            <motion.span
              key={tech}
              className="rounded-full glass-subtle px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-primary-500 cursor-default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2 + i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-medium text-[var(--muted-foreground)]">Kaydır</span>
          <ChevronDown className="h-5 w-5 text-primary-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
