"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Ana Sayfa", href: "#hero" },
  { label: "Hakkımda", href: "#about" },
  { label: "Hizmetler", href: "#services" },
  { label: "Projeler", href: "#projects" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "#contact" },
];

const sectionIds = ["hero", "about", "services", "projects", "blog", "contact"];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Smooth scroll-driven transforms
  const navWidth = useTransform(scrollY, [0, 250], ["100%", "min(880px, 88%)"]);
  const navBorderRadius = useTransform(scrollY, [0, 250], [0, 9999]);
  const navY = useTransform(scrollY, [0, 250], [0, 12]);
  const navPaddingTop = useTransform(scrollY, [0, 250], [0, 8]);
  // Backdrop opacity — drives glass visibility
  const backdropOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  useMotionValueEvent(scrollY, "change", (y) => {
    setIsScrolled(y > 10);
  });

  // Scroll spy — detect which section is currently in view
  const handleScroll = useCallback(() => {
    if (!isHome) return;
    const scrollPosition = window.scrollY + 200;

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const section = document.getElementById(sectionIds[i]);
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sectionIds[i]);
        break;
      }
    }
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, handleScroll]);

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      if (!isHome) {
        window.location.href = "/" + href;
      } else {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const isLinkActive = (href: string) => {
    if (!isHome) return false;
    if (href.startsWith("#")) {
      return activeSection === href.slice(1);
    }
    return false;
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ paddingTop: navPaddingTop }}
      >
        <motion.nav
          className="relative flex items-center justify-between px-6 lg:px-8 h-16"
          style={{
            width: navWidth,
            borderRadius: navBorderRadius,
            y: navY,
          }}
        >
          {/* Glass backdrop — separate element so CSS vars handle dark/light properly */}
          <motion.div
            className="absolute inset-0 rounded-[inherit] glass-subtle"
            style={{ opacity: backdropOpacity }}
            aria-hidden="true"
          />

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2 group">
            <motion.div
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-[var(--border)]"
              whileHover={{ scale: 1.05, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/logo.png"
                alt="Semih Karakaş — SK logo"
                width={26}
                height={21}
                priority
                className="object-contain"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 opacity-0 blur-lg transition-opacity group-hover:opacity-60" />
            </motion.div>
            {!isScrolled && (
              <span className="hidden text-lg font-semibold sm:block">
                <span className="text-gradient">skarakas</span>
                <span className="text-[var(--muted-foreground)]">.com</span>
              </span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="relative z-10 hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={isLinkActive(link.href)}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side: Theme Toggle, CTA */}
          <div className="relative z-10 flex items-center gap-2">
            <ThemeToggle />

            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contact");
              }}
              className="hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/25 transition-shadow hover:shadow-xl hover:shadow-primary-500/30"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              İletişim
              <ArrowRight className="h-4 w-4" />
            </motion.a>

            {/* Mobile Hamburger */}
            <motion.button
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] transition-colors hover:bg-[var(--border)]"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-20 left-4 right-4 z-50 glass rounded-3xl p-6"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-medium transition-colors hover:bg-[var(--muted)] ${isLinkActive(link.href) ? "text-primary-500 bg-primary-500/5" : ""}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {isLinkActive(link.href) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    )}
                    {link.label}
                  </motion.a>
                ))}
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#contact");
                    }}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-base font-medium text-white"
                  >
                    İletişime Geç
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* Individual Nav Link with animated underline */
function NavLink({
  href,
  children,
  active,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.a
      href={href}
      onClick={(e) => {
        if (href.startsWith("#")) e.preventDefault();
        onClick?.();
      }}
      className={`group relative px-4 py-2 text-sm font-medium transition-colors ${active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
      whileHover="hover"
    >
      {children}
      {/* Active indicator */}
      {active ? (
        <motion.span
          layoutId="navActiveIndicator"
          className="absolute bottom-0 left-1/2 h-0.5 w-[60%] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ) : (
        <motion.span
          className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          variants={{
            hover: { width: "60%", x: "-50%", opacity: 1 },
          }}
          initial={{ width: 0, x: "-50%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
    </motion.a>
  );
}
