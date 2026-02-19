"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Mail, MailOpen, Trash2, MessageSquare, Clock, Loader2, RefreshCw } from "lucide-react";
import type { Message } from "@/types";
import toast from "react-hot-toast";

export function AdminMessagesContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      toast.error("Mesajlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const selected = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  const toggleRead = async (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !msg.read }),
      });
      if (res.ok) {
        setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read: !m.read } : m)));
      }
    } catch {
      toast.error("Durum güncellenemedi");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((msgs) => msgs.filter((m) => m.id !== id));
        if (selectedId === id) setSelectedId(null);
        toast.success("Mesaj silindi");
      }
    } catch {
      toast.error("Silme hatası");
    }
  };

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      try {
        const res = await fetch(`/api/admin/messages/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
        if (res.ok) {
          setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read: true } : m)));
        }
      } catch { /* silent */ }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mesajlar</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            {messages.length} mesaj · {unreadCount > 0 ? `${unreadCount} okunmamış` : "Tüm mesajlar okundu"}
          </p>
        </div>
        <motion.button onClick={() => { setLoading(true); fetchMessages(); }} className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-all hover:border-primary-500 hover:text-primary-500" whileTap={{ scale: 0.95 }}>
          <RefreshCw className="h-4 w-4" />
          Yenile
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Message List */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
            {messages.length > 0 ? (
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.button key={msg.id} layout onClick={() => handleSelect(msg.id)} className={`w-full border-b border-[var(--border)] p-4 text-left transition-colors last:border-b-0 ${selectedId === msg.id ? "bg-primary-500/5" : "hover:bg-[var(--muted)]/50"} ${!msg.read ? "bg-primary-500/5" : ""}`} exit={{ opacity: 0, height: 0 }}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${!msg.read ? "text-primary-500" : "text-[var(--muted-foreground)]"}`}>
                        {msg.read ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${!msg.read ? "font-bold" : "font-medium"}`}>{msg.name}</p>
                          {!msg.read && <span className="ml-2 h-2 w-2 rounded-full bg-primary-500 shrink-0" />}
                        </div>
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">{msg.subject || "(Konu yok)"}</p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)] truncate">{msg.message}</p>
                        <p className="mt-2 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <Clock className="h-3 w-3" />
                          {new Date(msg.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
                <p className="mt-4 text-sm text-[var(--muted-foreground)]">Henüz mesaj yok.</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} className="glass-card rounded-2xl p-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selected.subject || "(Konu belirtilmedi)"}</h2>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{selected.name} &lt;{selected.email}&gt;</p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {new Date(selected.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRead(selected.id)} className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]" title={selected.read ? "Okunmadı işaretle" : "Okundu işaretle"}>
                      {selected.read ? <Mail className="h-5 w-5" /> : <MailOpen className="h-5 w-5" />}
                    </button>
                    <button onClick={() => deleteMessage(selected.id)} className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500" title="Sil">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-6">
                  <p className="whitespace-pre-wrap text-[var(--muted-foreground)] leading-relaxed">{selected.message}</p>
                </div>
                <div className="mt-8">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ""}`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25">
                    <Mail className="h-4 w-4" />
                    Yanıtla
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div className="glass-card flex h-full min-h-[400px] items-center justify-center rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
                  <p className="mt-4 text-sm text-[var(--muted-foreground)]">Bir mesaj seçin</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
