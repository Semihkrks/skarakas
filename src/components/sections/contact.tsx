"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SpotlightCard } from "@/components/animations/tilt-card";
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter, Loader2, CheckCircle, MessageCircle, Instagram } from "lucide-react";
import toast from "react-hot-toast";

const contactInfo = [
  { icon: Mail, label: "E-posta", value: "semih@skarakas.com", href: "mailto:semih@skarakas.com" },
  { icon: MapPin, label: "Konum", value: "Türkiye", href: null },
  { icon: Phone, label: "Telefon", value: "+90 (5XX) XXX XX XX", href: null },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/ssemihkarakass" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/ssemihkarakass" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/skarakas" },
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com/skarakas" },
];

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 4000);
      } else {
        toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch {
      toast.error("Bağlantı hatası, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--muted)]/30" />
      <div className="bg-gradient-mesh absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl  bg-gradient-to-br from-primary-500/10 to-accent-500/10">
            <MessageCircle className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-4xl font-bold sm:text-5xl">
            Birlikte <span className="text-gradient">Çalışalım</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
            Projeniz için bir fikriniz mi var? Birlikte harika şeyler yaratabiliriz. 
            Bana ulaşmaktan çekinmeyin.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Contact Form */}
          <ScrollReveal direction="left" className="lg:col-span-3">
            <SpotlightCard>
              <form onSubmit={handleSubmit} className="glass-card relative rounded-2xl p-8 md:p-10 overflow-visible">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <InputField
                    label="Adınız"
                    type="text"
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                    placeholder="Semih Karakaş"
                    required
                  />
                  <InputField
                    label="E-posta"
                    type="email"
                    value={formData.email}
                    onChange={(v) => setFormData({ ...formData, email: v })}
                    placeholder="semih@example.com"
                    required
                  />
                </div>
                <div className="mt-6">
                  <InputField
                    label="Konu"
                    type="text"
                    value={formData.subject}
                    onChange={(v) => setFormData({ ...formData, subject: v })}
                    placeholder="Proje hakkında"
                  />
                </div>
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium">
                    Mesajınız <span className="text-primary-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Projeniz hakkında detaylı bilgi verin..."
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm transition-all duration-300  placeholder:text-[var(--muted-foreground)]/50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:shadow-[0_0_20px_rgba(20,184,166,0.1)]"
                  />
                </div>

                <div className="relative mt-8">
                  {/* Particle effects on success */}
                  <AnimatePresence>
                    {isSubmitted && (
                      <>
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={`particle-${i}`}
                            className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                            style={{
                              background: i % 3 === 0 ? "#10b981" : i % 3 === 1 ? "#14b8a6" : "#6366f1",
                            }}
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                            animate={{
                              x: Math.cos((i * 30 * Math.PI) / 180) * (80 + Math.random() * 60),
                              y: Math.sin((i * 30 * Math.PI) / 180) * (80 + Math.random() * 60),
                              scale: 0,
                              opacity: 0,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.03 }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed"
                    animate={{
                      background: isSubmitted
                        ? "linear-gradient(to right, #10b981, #059669)"
                        : "linear-gradient(to right, #14b8a6, #6366f1)",
                      boxShadow: isSubmitted
                        ? "0 10px 30px -5px rgba(16, 185, 129, 0.4)"
                        : "0 10px 30px -5px rgba(20, 184, 166, 0.25)",
                    }}
                    whileHover={!isSubmitting && !isSubmitted ? { scale: 1.01, boxShadow: "0 15px 35px -5px rgba(20, 184, 166, 0.35)" } : {}}
                    whileTap={!isSubmitting && !isSubmitted ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Shimmer effect on hover */}
                    {!isSubmitting && !isSubmitted && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    )}

                    {/* Success ripple */}
                    <AnimatePresence>
                      {isSubmitted && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-emerald-400/30"
                          initial={{ scale: 0, borderRadius: "50%" }}
                          animate={{ scale: 2.5, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span
                          key="loading"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Gönderiliyor...
                        </motion.span>
                      ) : isSubmitted ? (
                        <motion.span
                          key="success"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        >
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </motion.span>
                          Gönderildi!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.span
                            className="inline-flex"
                            whileHover={{
                              x: [0, 4, 0],
                              y: [0, -4, 0],
                              rotate: [0, -15, 0],
                              transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1 },
                            }}
                          >
                            <Send className="h-5 w-5" />
                          </motion.span>
                          Mesaj Gönder
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Flying airplane animation */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      className="pointer-events-none absolute bottom-16 left-1/2 z-50"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                      animate={{
                        x: [0, 60, 200],
                        y: [0, -80, -200],
                        opacity: [1, 1, 0],
                        scale: [1, 1.3, 0.6],
                        rotate: [0, -25, -45],
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      <Send className="h-8 w-8 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Trail particles behind airplane */}
                <AnimatePresence>
                  {isSubmitted && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={`trail-${i}`}
                          className="pointer-events-none absolute bottom-16 left-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400/60"
                          initial={{ x: 0, y: 0, opacity: 0.8 }}
                          animate={{
                            x: [0, 30 + i * 10, 100 + i * 15],
                            y: [0, -40 - i * 10, -100 - i * 20],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.15 + i * 0.08,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </form>
            </SpotlightCard>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal direction="right" className="lg:col-span-2">
            <div className="space-y-6">
              {/* Contact Details */}
              {contactInfo.map((info, i) => (
                <ScrollReveal key={info.label} delay={i * 0.1}>
                  <div className="glass-card group flex items-center gap-4 rounded-2xl p-5 transition-all">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl  bg-gradient-to-br from-primary-500/10 to-accent-500/10  text-primary-500 transition-all group-hover:from-primary-500  group-hover:to-accent-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-500/25">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-semibold hover:text-primary-500 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold">{info.value}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              {/* Social Links */}
              <ScrollReveal delay={0.3}>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Sosyal Medya
                  </h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-xl  bg-[var(--muted)] text-[var(--muted-foreground)]  transition-all hover:bg-primary-500 hover:text-white hover:shadow-lg hover:shadow-primary-500/25"
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Availability */}
              <ScrollReveal delay={0.4}>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-sm font-medium">
                      Yeni projelere <span className="text-emerald-500">açığım</span>
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                    Genellikle 24 saat içinde yanıt veriyorum.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* Reusable Input Field */
function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label} {required && <span className="text-primary-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm transition-all duration-300  placeholder:text-[var(--muted-foreground)]/50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:shadow-[0_0_20px_rgba(20,184,166,0.1)]"
      />
    </div>
  );
}
