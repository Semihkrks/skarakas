"use client";

import { motion } from "framer-motion";
import { Save, Globe, Mail, Github, Linkedin, Twitter, Instagram, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SettingsData {
  siteTitle: string;
  siteDescription: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

const defaultSettings: SettingsData = {
  siteTitle: "",
  siteDescription: "",
  email: "",
  github: "",
  linkedin: "",
  twitter: "",
  instagram: "",
};

export function AdminSettingsContent() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          siteTitle: data.siteTitle || "",
          siteDescription: data.siteDescription || "",
          email: data.email || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
        });
      })
      .catch(() => toast.error("Ayarlar yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Ayarlar kaydedildi!");
      } else {
        toast.error("Kaydetme hatası");
      }
    } catch {
      toast.error("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-9 w-32 animate-pulse rounded-xl bg-[var(--muted)]" />
            <div className="mt-2 h-5 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
          </div>
          <div className="h-11 w-28 animate-pulse rounded-xl bg-[var(--muted)]" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-[var(--muted)]" />
          <div className="h-80 animate-pulse rounded-2xl bg-[var(--muted)]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Ayarlar</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Site ayarlarını düzenleyin.
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Kaydediliyor..." : "Kaydet"}
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
              <label className="mb-2 block text-sm font-medium">
                Site Başlığı
              </label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) =>
                  setSettings({ ...settings, siteTitle: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Site Açıklaması
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    siteDescription: e.target.value,
                  })
                }
                rows={3}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
                onChange={(e) =>
                  setSettings({ ...settings, github: e.target.value })
                }
                placeholder="https://github.com/username"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </label>
              <input
                type="url"
                value={settings.linkedin}
                onChange={(e) =>
                  setSettings({ ...settings, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Twitter className="h-4 w-4" /> Twitter / X
              </label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) =>
                  setSettings({ ...settings, twitter: e.target.value })
                }
                placeholder="https://twitter.com/username"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Instagram className="h-4 w-4" /> Instagram
              </label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) =>
                  setSettings({ ...settings, instagram: e.target.value })
                }
                placeholder="https://instagram.com/username"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
