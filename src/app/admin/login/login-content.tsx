"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Github, Chrome } from "lucide-react";

export function AdminLoginContent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-mesh">
      <motion.div
        className="glass-card mx-4 w-full max-w-md rounded-3xl p-10 text-center"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl  bg-gradient-to-br from-primary-500 to-accent-500 text-2xl font-bold text-white">
          SK
        </div>

        <h1 className="mb-2 text-2xl font-bold">Admin Panel</h1>
        <p className="mb-8 text-sm text-[var(--muted-foreground)]">
          skarakas.com yönetim paneline giriş yapın.
        </p>

        <div className="space-y-4">
          <motion.button
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#24292e]  px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Github className="h-5 w-5" />
            GitHub ile Giriş Yap
          </motion.button>

          <motion.button
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)]  bg-[var(--background)] px-6 py-3.5 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Chrome className="h-5 w-5" />
            Google ile Giriş Yap
          </motion.button>
        </div>

        <p className="mt-8 text-xs text-[var(--muted-foreground)]">
          Sadece yetkili hesaplar giriş yapabilir.
        </p>
      </motion.div>
    </div>
  );
}
