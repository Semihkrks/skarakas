"use client";

import { motion } from "framer-motion";
import { Save, Globe, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function AdminSettingsContent() {
  const [settings, setSettings] = useState({
    siteTitle: "Semih Karakaş",
    siteDescription: "Full-Stack Yazılım Geliştirici",
    email: "semih@skarakas.com",
    github: "https://github.com/skarakas",
    linkedin: "https://linkedin.com/in/skarakas",
    twitter: "https://twitter.com/skarakas",
  });

  const handleSave = () => {
    // In production, save to Supabase
    toast.success("Ayarlar kaydedildi!");
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ayarlar</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Site ayarlarını düzenleyin.
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500  px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="h-4 w-4" />
          Kaydet
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* General Settings */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
            <Globe className="h-5 w-5 text-primary-500" />
            Genel Ayarlar
          </h2>
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Site Başlığı</label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm focus:border-primary-500 focus:outline-none  focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Site Açıklaması</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm focus:border-primary-500 focus:outline-none  focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                <Mail className="mr-1 inline h-4 w-4" />
                E-posta
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm focus:border-primary-500 focus:outline-none  focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-6 text-lg font-bold">Sosyal Medya</h2>
          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Github className="h-4 w-4" /> GitHub
              </label>
              <input
                type="url"
                value={settings.github}
                onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm focus:border-primary-500 focus:outline-none  focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </label>
              <input
                type="url"
                value={settings.linkedin}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm focus:border-primary-500 focus:outline-none  focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Twitter className="h-4 w-4" /> Twitter / X
              </label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]  px-4 py-3 text-sm focus:border-primary-500 focus:outline-none  focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
