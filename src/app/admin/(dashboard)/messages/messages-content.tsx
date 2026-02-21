"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  MessageSquare,
  Clock,
  Loader2,
  RefreshCw,
  Send,
  Search,
  CheckCircle2,
  X,
} from "lucide-react";
import type { Message } from "@/types";
import toast from "react-hot-toast";

export function AdminMessagesContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const selected = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || "").toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

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
        setMessages((msgs) =>
          msgs.map((m) => (m.id === id ? { ...m, read: !m.read } : m))
        );
      }
    } catch {
      toast.error("Durum güncellenemedi");
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((msgs) => msgs.filter((m) => m.id !== id));
        if (selectedId === id) setSelectedId(null);
        toast.success("Mesaj silindi");
      }
    } catch {
      toast.error("Silme hatası");
    }
    setDeleteConfirmId(null);
  };

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    setShowReplyForm(false);
    setReplyText("");
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      try {
        const res = await fetch(`/api/admin/messages/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
        if (res.ok) {
          setMessages((msgs) =>
            msgs.map((m) => (m.id === id ? { ...m, read: true } : m))
          );
        }
      } catch {
        /* silent */
      }
    }
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/admin/messages/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText }),
      });
      if (res.ok) {
        toast.success("Yanıt gönderildi!");
        setMessages((msgs) =>
          msgs.map((m) =>
            m.id === selected.id
              ? {
                  ...m,
                  replied_at: new Date().toISOString(),
                  reply_text: replyText,
                  read: true,
                }
              : m
          )
        );
        setShowReplyForm(false);
        setReplyText("");
      } else {
        const err = await res.json();
        toast.error(err.error || "Yanıt gönderilemedi");
      }
    } catch {
      toast.error("Bağlantı hatası");
    } finally {
      setReplying(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-9 w-40 animate-pulse rounded-xl bg-[var(--muted)]" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-[var(--muted)]"
              />
            ))}
          </div>
          <div className="lg:col-span-3">
            <div className="h-96 animate-pulse rounded-2xl bg-[var(--muted)]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Mesajlar</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {messages.length} mesaj ·{" "}
            {unreadCount > 0
              ? `${unreadCount} okunmamış`
              : "Tüm mesajlar okundu"}
          </p>
        </div>
        <motion.button
          onClick={() => {
            setLoading(true);
            fetchMessages();
          }}
          className="flex items-center gap-2 self-start rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-all hover:border-primary-500 hover:text-primary-500"
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mesajlarda ara (isim, email, konu)..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Message List */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden rounded-2xl">
            {filteredMessages.length > 0 ? (
              <AnimatePresence>
                {filteredMessages.map((msg) => (
                  <motion.button
                    key={msg.id}
                    layout
                    onClick={() => handleSelect(msg.id)}
                    className={`w-full border-b border-[var(--border)] p-4 text-left transition-colors last:border-b-0 ${
                      selectedId === msg.id
                        ? "bg-primary-500/5"
                        : "hover:bg-[var(--muted)]/50"
                    } ${!msg.read ? "bg-primary-500/5" : ""}`}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${
                          !msg.read
                            ? "text-primary-500"
                            : "text-[var(--muted-foreground)]"
                        }`}
                      >
                        {msg.read ? (
                          <MailOpen className="h-5 w-5" />
                        ) : (
                          <Mail className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`truncate text-sm ${
                              !msg.read ? "font-bold" : "font-medium"
                            }`}
                          >
                            {msg.name}
                          </p>
                          <div className="ml-2 flex shrink-0 items-center gap-1.5">
                            {msg.replied_at && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                            {!msg.read && (
                              <span className="h-2 w-2 rounded-full bg-primary-500" />
                            )}
                          </div>
                        </div>
                        <p className="truncate text-sm font-medium text-[var(--foreground)]">
                          {msg.subject || "(Konu yok)"}
                        </p>
                        <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
                          {msg.message}
                        </p>
                        <p className="mt-2 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <Clock className="h-3 w-3" />
                          {new Date(msg.created_at).toLocaleDateString(
                            "tr-TR",
                            {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
                <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                  {search ? "Arama sonucu bulunamadı." : "Henüz mesaj yok."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                className="glass-card rounded-2xl p-6 sm:p-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold sm:text-xl">
                      {selected.subject || "(Konu belirtilmedi)"}
                    </h2>
                    <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">
                      {selected.name} &lt;{selected.email}&gt;
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {new Date(selected.created_at).toLocaleDateString(
                        "tr-TR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => toggleRead(selected.id)}
                      className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
                      title={
                        selected.read
                          ? "Okunmadı işaretle"
                          : "Okundu işaretle"
                      }
                    >
                      {selected.read ? (
                        <Mail className="h-5 w-5" />
                      ) : (
                        <MailOpen className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(selected.id)}
                      className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                      title="Sil"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-6">
                  <p className="whitespace-pre-wrap leading-relaxed text-[var(--muted-foreground)]">
                    {selected.message}
                  </p>
                </div>

                {/* Reply Section */}
                <div className="mt-8 border-t border-[var(--border)] pt-6">
                  {selected.replied_at ? (
                    <div className="rounded-xl bg-emerald-500/10 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Yanıtlandı -{" "}
                          {new Date(selected.replied_at).toLocaleDateString(
                            "tr-TR",
                            {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-[var(--muted-foreground)]">
                        {selected.reply_text}
                      </p>
                    </div>
                  ) : showReplyForm ? (
                    <div className="space-y-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Yanıtınızı yazın..."
                        rows={4}
                        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          onClick={handleReply}
                          disabled={replying || !replyText.trim()}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/25 disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {replying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          {replying ? "Gönderiliyor..." : "E-posta Gönder"}
                        </motion.button>
                        <button
                          onClick={() => {
                            setShowReplyForm(false);
                            setReplyText("");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                        >
                          <X className="h-4 w-4" />
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => setShowReplyForm(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Mail className="h-4 w-4" />
                      Yanıtla
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="glass-card flex h-full min-h-[400px] items-center justify-center rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
                  <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                    Bir mesaj seçin
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="glass-card w-full max-w-sm rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">Mesajı Sil</h3>
                </div>
                <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                  Bu mesajı silmek istediğinize emin misiniz? Bu işlem geri
                  alınamaz.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => deleteMessage(deleteConfirmId)}
                    className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                  >
                    Evet, Sil
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
