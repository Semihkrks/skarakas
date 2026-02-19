"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUp, Heart, Instagram } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Github, href: "https://github.com/ssemihkarakass", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com/ssemihkarakass", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/in/skarakas", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/skarakas", label: "Twitter" },
  { icon: Mail, href: "mailto:semih@skarakas.com", label: "E-posta" },
];

const footerLinks = [
  {
    title: "Navigasyon",
    links: [
      { label: "Ana Sayfa", href: "#hero" },
      { label: "Hakkımda", href: "#about" },
      { label: "Hizmetler", href: "#services" },
      { label: "Projeler", href: "#projects" },
    ],
  },
  {
    title: "Diğer",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "İletişim", href: "#contact" },
    ],
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--muted)]/30">
      {/* Background mesh */}
      <div className="bg-gradient-mesh absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl  bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white text-sm">
                SK
              </div>
              <span className="text-xl font-bold">
                <span className="text-gradient">skarakas</span>
                <span className="text-[var(--muted-foreground)]">.com</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[var(--muted-foreground)] leading-relaxed">
              Modern web teknolojileri ile yüksek kaliteli, performanslı ve 
              kullanıcı deneyimi odaklı dijital çözümler üretiyorum.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full  glass-subtle text-[var(--muted-foreground)] transition-colors  hover:text-primary-500"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-primary-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Semih Karakaş. Tüm hakları saklıdır.
          </p>

          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 rounded-full glass-subtle px-4 py-2 text-sm  text-[var(--muted-foreground)] transition-colors hover:text-primary-500"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Yukarı Çık
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
