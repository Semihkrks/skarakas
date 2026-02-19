"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, ExternalLink, Star, FolderKanban, X, Save, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { Project } from "@/types";
import toast from "react-hot-toast";

const gradientOptions = [
  "from-teal-500 to-cyan-500",
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
];

const categoryOptions = ["Web", "Mobil", "API", "UI/UX", "DevOps"];

const emptyProject = {
  title: "",
  description: "",
  category: "Web",
  tags: [] as string[],
  gradient: "from-teal-500 to-cyan-500",
  live_url: "",
  github_url: "",
  featured: false,
  sort_order: 0,
};

export function AdminProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      toast.error("Projeler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openNew = () => {
    setEditingProject({ ...emptyProject, sort_order: projects.length + 1 });
    setTagInput("");
    setShowEditor(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject({ ...project });
    setTagInput("");
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!editingProject?.title || !editingProject?.description) {
      toast.error("Başlık ve açıklama zorunludur");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editingProject.id;
      const url = isEdit ? `/api/admin/projects/${editingProject.id}` : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingProject) });
      if (res.ok) {
        toast.success(isEdit ? "Proje güncellendi" : "Proje oluşturuldu");
        setShowEditor(false);
        setEditingProject(null);
        fetchProjects();
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
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Proje silindi"); fetchProjects(); }
      else toast.error("Silme hatası");
    } catch { toast.error("Bağlantı hatası"); }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        toast.success(project.featured ? "Öne çıkan kaldırıldı" : "Öne çıkan yapıldı");
        fetchProjects();
      }
    } catch { toast.error("Hata oluştu"); }
  };

  const addTag = () => {
    if (tagInput.trim() && editingProject) {
      const currentTags = editingProject.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setEditingProject({ ...editingProject, tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    if (editingProject) setEditingProject({ ...editingProject, tags: (editingProject.tags || []).filter((t) => t !== tag) });
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
          <h1 className="text-3xl font-bold">Projeler</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{projects.length} proje · {projects.filter((p) => p.featured).length} öne çıkan</p>
        </div>
        <motion.button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary-500/25" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="h-4 w-4" />
          Yeni Proje
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card group overflow-hidden rounded-2xl">
            <div className={`h-32 w-full bg-gradient-to-br ${project.gradient} relative`}>
              {project.featured && (
                <div className="absolute top-3 right-3">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white/20">{project.title.charAt(0)}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold">{project.title}</h3>
                <span className="rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:text-primary-400">{project.category}</span>
              </div>
              <p className="mb-2 text-xs text-[var(--muted-foreground)] line-clamp-2">{project.description}</p>
              <div className="mb-4 flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(project)} className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium transition-all hover:border-primary-500 hover:text-primary-500"><Edit className="mx-auto h-4 w-4" /></button>
                <button onClick={() => toggleFeatured(project)} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${project.featured ? "border-amber-500 text-amber-500" : "border-[var(--border)] hover:border-amber-500 hover:text-amber-500"}`}><Star className={`mx-auto h-4 w-4 ${project.featured ? "fill-current" : ""}`} /></button>
                {project.live_url && project.live_url !== "#" && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium transition-all hover:border-blue-500 hover:text-blue-500"><ExternalLink className="mx-auto h-4 w-4" /></a>
                )}
                <button onClick={() => handleDelete(project.id)} className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium transition-all hover:border-red-500 hover:text-red-500"><Trash2 className="mx-auto h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="py-20 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Henüz proje eklenmemiş.</p>
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && editingProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-20">
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} className="relative w-full max-w-3xl glass-card rounded-2xl p-8 mb-10">
              <button onClick={() => { setShowEditor(false); setEditingProject(null); }} className="absolute top-4 right-4 rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"><X className="h-5 w-5" /></button>
              <h2 className="mb-6 text-2xl font-bold">{editingProject.id ? "Projeyi Düzenle" : "Yeni Proje"}</h2>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Başlık</label>
                  <input type="text" value={editingProject.title || ""} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} placeholder="Proje adı..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Açıklama</label>
                  <textarea value={editingProject.description || ""} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} rows={3} placeholder="Proje açıklaması..." className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Kategori</label>
                    <select value={editingProject.category || "Web"} onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                      {categoryOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Gradient</label>
                    <select value={editingProject.gradient || gradientOptions[0]} onChange={(e) => setEditingProject({ ...editingProject, gradient: e.target.value })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                      {gradientOptions.map((g) => (<option key={g} value={g}>{g.replace("from-", "").replace(" to-", " → ")}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Canlı URL</label>
                    <input type="url" value={editingProject.live_url || ""} onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })} placeholder="https://..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">GitHub URL</label>
                    <input type="url" value={editingProject.github_url || ""} onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })} placeholder="https://github.com/..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Teknolojiler</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingProject.tags || []).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Teknoloji ekle..." className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                    <button onClick={addTag} className="rounded-xl bg-[var(--muted)] px-4 py-2 text-sm font-medium hover:bg-primary-500/10">Ekle</button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingProject.featured || false} onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })} className="h-4 w-4 rounded border-[var(--border)] text-primary-500 focus:ring-primary-500" />
                    <span className="text-sm font-medium">Öne Çıkan</span>
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
