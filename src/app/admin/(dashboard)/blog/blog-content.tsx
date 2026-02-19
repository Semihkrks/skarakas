"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Search, FileText, X, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { BlogPost } from "@/types";
import toast from "react-hot-toast";

const gradientOptions = [
  "from-teal-500 to-cyan-500",
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
];

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Web Geliştirme",
  tags: [] as string[],
  status: "draft" as const,
  reading_time: "5 dk",
  gradient: "from-teal-500 to-cyan-500",
};

export function AdminBlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {
      toast.error("Blog yazıları yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const openNewPost = () => {
    setEditingPost({ ...emptyPost });
    setTagInput("");
    setShowEditor(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setTagInput("");
    setShowEditor(true);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost?.content) {
      toast.error("Başlık ve içerik zorunludur");
      return;
    }
    setSaving(true);
    try {
      const slug = editingPost.slug || generateSlug(editingPost.title);
      const payload = { ...editingPost, slug };
      const isEdit = !!editingPost.id;
      const url = isEdit ? `/api/admin/blog/${editingPost.id}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(isEdit ? "Yazı güncellendi" : "Yazı oluşturuldu");
        setShowEditor(false);
        setEditingPost(null);
        fetchPosts();
      } else {
        const err = await res.json();
        toast.error(err.error || "Kaydetme hatası");
      }
    } catch {
      toast.error("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Yazı silindi"); fetchPosts(); }
      else toast.error("Silme hatası");
    } catch { toast.error("Bağlantı hatası"); }
  };

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      if (res.ok) { toast.success(newStatus === "published" ? "Yazı yayınlandı" : "Yazı taslağa alındı"); fetchPosts(); }
    } catch { toast.error("Durum değiştirilemedi"); }
  };

  const addTag = () => {
    if (tagInput.trim() && editingPost) {
      const currentTags = editingPost.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setEditingPost({ ...editingPost, tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    if (editingPost) setEditingPost({ ...editingPost, tags: (editingPost.tags || []).filter((t) => t !== tag) });
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
          <h1 className="text-3xl font-bold">Blog Yazıları</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{posts.length} yazı · {posts.filter((p) => p.status === "published").length} yayında</p>
        </div>
        <motion.button onClick={openNewPost} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="h-4 w-4" />
          Yeni Yazı
        </motion.button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input type="text" placeholder="Yazılarda ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Başlık</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Durum</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Tarih</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((post, i) => (
                <motion.tr key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="transition-colors hover:bg-[var(--muted)]/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[var(--muted-foreground)]" />
                      <div>
                        <p className="text-sm font-medium">{post.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">/{post.slug} · {post.reading_time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(post)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${post.status === "published" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"}`}>
                      {post.status === "published" ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{new Date(post.created_at).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"><Eye className="h-4 w-4" /></a>
                      <button onClick={() => openEditPost(post)} className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(post.id)} className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">{search ? "Yazı bulunamadı." : "Henüz yazı eklenmemiş."}</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && editingPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-20">
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} className="relative w-full max-w-4xl glass-card rounded-2xl p-8 mb-10">
              <button onClick={() => { setShowEditor(false); setEditingPost(null); }} className="absolute top-4 right-4 rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"><X className="h-5 w-5" /></button>
              <h2 className="mb-6 text-2xl font-bold">{editingPost.id ? "Yazıyı Düzenle" : "Yeni Yazı"}</h2>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Başlık</label>
                  <input type="text" value={editingPost.title || ""} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value, slug: editingPost.id ? editingPost.slug : generateSlug(e.target.value) })} placeholder="Yazı başlığı..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Slug</label>
                  <input type="text" value={editingPost.slug || ""} onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })} placeholder="yazi-slug" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Özet</label>
                  <input type="text" value={editingPost.excerpt || ""} onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })} placeholder="Kısa açıklama..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Kategori</label>
                    <input type="text" value={editingPost.category || ""} onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Okuma Süresi</label>
                    <input type="text" value={editingPost.reading_time || ""} onChange={(e) => setEditingPost({ ...editingPost, reading_time: e.target.value })} placeholder="5 dk" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Gradient</label>
                    <select value={editingPost.gradient || gradientOptions[0]} onChange={(e) => setEditingPost({ ...editingPost, gradient: e.target.value })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                      {gradientOptions.map((g) => (<option key={g} value={g}>{g.replace("from-", "").replace(" to-", " → ")}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Etiketler</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingPost.tags || []).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Etiket ekle..." className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                    <button onClick={addTag} className="rounded-xl bg-[var(--muted)] px-4 py-2 text-sm font-medium hover:bg-primary-500/10">Ekle</button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">İçerik (Markdown)</label>
                  <textarea value={editingPost.content || ""} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} rows={15} placeholder="Markdown formatında yazı içeriği..." className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-mono focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingPost.status === "published"} onChange={(e) => setEditingPost({ ...editingPost, status: e.target.checked ? "published" : "draft" })} className="h-4 w-4 rounded border-[var(--border)] text-primary-500 focus:ring-primary-500" />
                    <span className="text-sm font-medium">Yayınla</span>
                  </label>
                  <motion.button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25 disabled:opacity-70" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
