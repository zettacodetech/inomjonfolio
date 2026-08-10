"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LogOut, Plus, Trash2, Pencil, X, Check,
  Tag, FolderKanban, ExternalLink, Github,
  Star, ChevronDown, ChevronUp, Loader2, User,
  FileText, Code2, Briefcase, MessageSquareQuote, Save,
  Inbox as InboxIcon, Mail, Phone,
} from "lucide-react";

// Uses relative URLs — Next.js rewrites proxy /api/v1/* to the backend
const BACKEND = "";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TagItem  { id: string; name: string; slug: string }
interface Project  {
  id: string; title: string; description: string;
  tech_stack: string[]; github_link: string | null;
  live_link: string | null; featured: boolean;
  tags: TagItem[]; created_at: string;
}
interface ProjectForm {
  title: string; description: string; tech_stack: string;
  github_link: string; live_link: string;
  featured: boolean; tag_ids: string[];
}
interface AnalyticsData {
  total_visits: number;
  unique_visitors: number;
  today_visits: number;
  daily_visits: { day: string; count: number }[];
  page_visits: { path: string; count: number }[];
  recent_visits: {
    id: string;
    visitor_label: string;
    path: string;
    referrer: string | null;
    created_at: string;
  }[];
}

const emptyForm = (): ProjectForm => ({
  title: "", description: "", tech_stack: "",
  github_link: "", live_link: "", featured: false, tag_ids: [],
});

function authH(token: string): HeadersInit {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ─── Profile types ────────────────────────────────────────────────────────────

interface ProfileData {
  name: string;
  phone_number: string | null;
  contact_email: string | null;
  location: string | null;
  telegram_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  cv_url: string | null;
  headline_uz: string | null;
  headline_en: string | null;
  headline_ru: string | null;
  bio_uz: string | null;
  bio_en: string | null;
  bio_ru: string | null;
  career_start_date: string | null;
  happy_clients_count: number;
  experience_years_override: number | null;
}

// ─── Blog / Experience / Testimonial types ───────────────────────────────────

interface PostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
}

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  published: boolean;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
}

interface ExperienceForm {
  role: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
}

interface TestimonialItem {
  id: string;
  author: string;
  role: string | null;
  text: string;
  rating: number;
  sort_order: number;
}

interface TestimonialForm {
  author: string;
  role: string;
  text: string;
  rating: number;
  sort_order: number;
}

interface SkillItem {
  id: string;
  name: string;
  group: string | null;
  sort_order: number;
}

interface SkillForm {
  name: string;
  group: string;
  sort_order: number;
}

// ─── Tiny UI atoms ────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white " +
  "placeholder:text-zinc-600 outline-none transition focus:border-zinc-600 focus:bg-zinc-800/60";

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">{children}</p>;
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "blue" | "amber" | "green" }) {
  const cls = {
    default: "border-zinc-700 text-zinc-400",
    blue:    "border-blue-500/30 text-blue-400",
    amber:   "border-amber-500/30 text-amber-400",
    green:   "border-emerald-500/30 text-emerald-400",
  }[variant];
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  );
}

function Spinner() {
  return <Loader2 size={16} className="animate-spin" />;
}

// ─── Profile Editor tab ───────────────────────────────────────────────────────

function ProfileEditor({ token }: { token: string }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm]       = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState(false);
  const [saved, setSaved]     = useState(false);
  const [err, setErr]         = useState("");

  useEffect(() => {
    fetch(`${BACKEND}/api/v1/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setProfile(d); setForm(d); })
      .catch(() => setErr("Profil yuklashda xatolik."))
      .finally(() => setLoading(false));
  }, [token]);

  const set = (k: keyof ProfileData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setBusy(true); setErr(""); setSaved(false);
    try {
      const body: Record<string, unknown> = { ...form };
      const res = await fetch(`${BACKEND}/api/v1/admin/profile`, {
        method: "PUT",
        headers: authH(token),
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setErr(d.detail ?? "Xatolik."); return; }
      const updated = await res.json();
      setProfile(updated); setForm(updated); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setErr("Tarmoq xatoligi."); }
    finally { setBusy(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 size={24} className="animate-spin text-zinc-600" />
    </div>
  );

  const field = (label: string, key: keyof ProfileData, type: string = "text", placeholder?: string) => (
    <div key={key}>
      <Label>{label}</Label>
      <input
        type={type}
        placeholder={placeholder ?? label}
        value={(form[key] as string) ?? ""}
        onChange={(e) => set(key, e.target.value || null)}
        className={inputCls}
      />
    </div>
  );

  const textarea = (label: string, key: keyof ProfileData, placeholder?: string) => (
    <div key={key}>
      <Label>{label}</Label>
      <textarea
        placeholder={placeholder ?? label}
        value={(form[key] as string) ?? ""}
        onChange={(e) => set(key, e.target.value || null)}
        rows={3}
        className={`${inputCls} resize-none`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Contact info */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Aloqa ma'lumotlari</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Ism", "name")}
          {field("Telefon raqam", "phone_number", "tel", "+998XXXXXXXXX")}
          {field("Email (contact)", "contact_email", "email", "toshmirzayevinomjon@gmail.com")}
          {field("Joylashuv", "location", "text", "Qashqadaryo, Uzbekistan")}
        </div>
      </div>

      {/* Social links */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Ijtimoiy havolalar</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Telegram URL", "telegram_url", "url", "https://t.me/...")}
          {field("GitHub URL", "github_url", "url", "https://github.com/...")}
          {field("LinkedIn URL", "linkedin_url", "url", "https://linkedin.com/in/...")}
          {field("Instagram URL", "instagram_url", "url", "https://instagram.com/...")}
          {field("CV/Resume URL", "cv_url", "url", "https://...")}
        </div>
      </div>

      {/* Headlines */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Sarlavhalar</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {field("Headline (UZ)", "headline_uz")}
          {field("Headline (EN)", "headline_en")}
          {field("Headline (RU)", "headline_ru")}
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Bio</p>
        <div className="grid gap-4">
          {textarea("Bio (UZ)", "bio_uz")}
          {textarea("Bio (EN)", "bio_en")}
          {textarea("Bio (RU)", "bio_ru")}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Statistika</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {field("Karera boshlangan sana", "career_start_date", "date")}
          <div>
            <Label>Baxtli mijozlar soni</Label>
            <input
              type="number"
              min={0}
              value={(form.happy_clients_count as number) ?? 0}
              onChange={(e) => set("happy_clients_count", Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Tajriba yillari (avtomatik o'rniga)</Label>
            <input
              type="number"
              min={0}
              placeholder="Avtomatik: boshlangan sanadan"
              value={(form.experience_years_override as number | null) ?? ""}
              onChange={(e) =>
                set("experience_years_override", e.target.value === "" ? null : Number(e.target.value))
              }
              className={inputCls}
            />
            <p className="mt-1.5 text-[11px] text-zinc-600">
              Bo'sh qoldirilsa, karera boshlangan sanadan avtomatik hisoblanadi.
            </p>
          </div>
        </div>
      </div>

      {err && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">{err}</div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={busy}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-60 transition-all active:scale-[0.97]">
          {busy ? <Spinner /> : <Check size={14} />}
          Saqlash
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <Check size={14} /> Saqlandi!
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Tag Manager tab ──────────────────────────────────────────────────────────

function TagManager({ token, tags, onTagsChange }: {
  token: string; tags: TagItem[]; onTagsChange: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [err, setErr]   = useState("");
  const [busy, setBusy] = useState(false);

  const autoSlug = (v: string) => v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) { setErr("Name va slug kerak."); return; }
    setBusy(true); setErr("");
    try {
      const res = await fetch(`${BACKEND}/api/v1/admin/tags`, {
        method: "POST", headers: authH(token),
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
      });
      if (!res.ok) { const d = await res.json(); setErr(d.detail ?? "Xatolik"); return; }
      setName(""); setSlug(""); onTagsChange();
    } catch { setErr("Tarmoq xatoligi."); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tegni o'chirish?")) return;
    await fetch(`${BACKEND}/api/v1/admin/tags/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    onTagsChange();
  };

  return (
    <div className="space-y-6">
      {/* Existing tags */}
      <div>
        <Label>Mavjud teglar</Label>
        <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
          {tags.length === 0 && <p className="text-sm text-zinc-600">Hali teg yo'q.</p>}
          {tags.map((t) => (
            <div key={t.id}
              className="group flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
              <Tag size={11} className="text-zinc-600" />
              <span>{t.name}</span>
              <span className="text-zinc-700 text-xs">/{t.slug}</span>
              <button
                onClick={() => handleDelete(t.id)}
                className="ml-0.5 text-zinc-600 hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add tag form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <Label>Yangi teg qo'shish</Label>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <input
              placeholder="Nomi (Python)"
              value={name}
              onChange={(e) => { setName(e.target.value); setSlug(autoSlug(e.target.value)); }}
              className={inputCls}
            />
          </div>
          <div className="w-36">
            <input
              placeholder="slug"
              value={slug}
              onChange={(e) => setSlug(autoSlug(e.target.value))}
              className={inputCls}
            />
          </div>
          <button
            onClick={handleCreate} disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-50 transition-all active:scale-[0.97] whitespace-nowrap">
            {busy ? <Spinner /> : <Plus size={14} />} Qo'shish
          </button>
        </div>
        {err && <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-400">{err}</p>}
      </div>
    </div>
  );
}

// ─── Project Form (add / edit) ────────────────────────────────────────────────

function ProjectFormPanel({ token, tags, initial, onSaved, onCancel }: {
  token: string; tags: TagItem[]; initial?: Project;
  onSaved: () => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<ProjectForm>(
    initial ? {
      title: initial.title, description: initial.description,
      tech_stack: initial.tech_stack.join(", "),
      github_link: initial.github_link ?? "", live_link: initial.live_link ?? "",
      featured: initial.featured, tag_ids: initial.tags.map((t) => t.id),
    } : emptyForm()
  );
  const [err, setErr]   = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof ProjectForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTag = (id: string) =>
    set("tag_ids", form.tag_ids.includes(id)
      ? form.tag_ids.filter((x) => x !== id)
      : [...form.tag_ids, id]);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setErr("Sarlavha va tavsif majburiy."); return;
    }
    setBusy(true); setErr("");
    const techArr = form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean);
    const body: Record<string, unknown> = {
      title: form.title.trim(), description: form.description.trim(),
      tech_stack: techArr, featured: form.featured, tag_ids: form.tag_ids,
    };
    if (form.github_link.trim()) body.github_link = form.github_link.trim();
    if (form.live_link.trim())   body.live_link   = form.live_link.trim();

    try {
      const url = initial
        ? `${BACKEND}/api/v1/projects/${initial.id}`
        : `${BACKEND}/api/v1/projects`;
      const res = await fetch(url, {
        method: initial ? "PATCH" : "POST",
        headers: authH(token), body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setErr(d.detail ?? "Xatolik."); return; }
      onSaved();
    } catch { setErr("Tarmoq xatoligi."); }
    finally { setBusy(false); }
  };

  return (
    <div className="rounded-2xl border border-zinc-700/60 bg-[#141414] p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            {initial ? "Loyihani tahrirlash" : "Yangi loyiha"}
          </h3>
          <p className="text-xs text-zinc-600 mt-0.5">
            {initial ? "Ma'lumotlarni yangilang" : "Barcha loyihalar sahifasida ko'rinadi"}
          </p>
        </div>
        <button onClick={onCancel}
          className="rounded-xl p-2 text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <Label>Sarlavha</Label>
          <input placeholder="Portfolio websayt" value={form.title}
            onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <Label>Tavsif</Label>
          <textarea placeholder="Loyiha haqida qisqacha..."
            value={form.description} onChange={(e) => set("description", e.target.value)}
            rows={3} className={`${inputCls} resize-none`} />
        </div>

        {/* Tech stack */}
        <div className="sm:col-span-2">
          <Label>Texnologiyalar (vergul bilan)</Label>
          <input placeholder="Python, FastAPI, PostgreSQL"
            value={form.tech_stack} onChange={(e) => set("tech_stack", e.target.value)}
            className={inputCls} />
        </div>

        {/* GitHub */}
        <div>
          <Label>GitHub havolasi</Label>
          <input placeholder="https://github.com/..." value={form.github_link}
            onChange={(e) => set("github_link", e.target.value)} className={inputCls} />
        </div>

        {/* Live */}
        <div>
          <Label>Live havola</Label>
          <input placeholder="https://..." value={form.live_link}
            onChange={(e) => set("live_link", e.target.value)} className={inputCls} />
        </div>

        {/* Featured toggle */}
        <div className="sm:col-span-2">
          <button type="button" onClick={() => set("featured", !form.featured)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${
              form.featured
                ? "border-amber-500/40 bg-amber-500/5"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}>
            <div className="flex items-center gap-2.5">
              <Star size={14} className={form.featured ? "fill-amber-400 text-amber-400" : "text-zinc-600"} />
              <span className="text-sm font-medium text-white">Featured loyiha</span>
              <span className="text-xs text-zinc-600">(birinchi o'rinda ko'rsatiladi)</span>
            </div>
            <div className={`flex h-5 w-9 items-center rounded-full transition-colors ${form.featured ? "bg-amber-500" : "bg-zinc-700"}`}>
              <span className={`ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-4" : ""}`} />
            </div>
          </button>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="sm:col-span-2">
            <Label>Teglar</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => {
                const sel = form.tag_ids.includes(t.id);
                return (
                  <button key={t.id} onClick={() => toggleTag(t.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      sel
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
                    }`}>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {err && (
        <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {err}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button onClick={handleSubmit} disabled={busy}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-60 transition-all active:scale-[0.97]">
          {busy ? <Spinner /> : <Check size={14} />}
          {initial ? "Saqlash" : "Yaratish"}
        </button>
        <button onClick={onCancel}
          className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
          Bekor
        </button>
      </div>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, onEdit, onDelete }: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden transition-all hover:border-zinc-700">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-white">{project.title}</h3>
              {project.featured && (
                <Badge variant="amber">
                  <span className="flex items-center gap-1"><Star size={9} className="fill-amber-400" /> Featured</span>
                </Badge>
              )}
              {project.tags.map((t) => (
                <Badge key={t.id} variant="blue">{t.name}</Badge>
              ))}
            </div>

            <p className={`mt-2 text-xs text-zinc-500 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
              {project.description}
            </p>

            {project.description.length > 120 && (
              <button onClick={() => setExpanded((v) => !v)}
                className="mt-1 flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
                {expanded ? <><ChevronUp size={11} /> Yig'ish</> : <><ChevronDown size={11} /> Ko'proq</>}
              </button>
            )}

            {project.tech_stack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech_stack.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center gap-4">
              {project.github_link && (
                <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
                  <Github size={12} /> GitHub
                </a>
              )}
              {project.live_link && (
                <a href={project.live_link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
                  <ExternalLink size={12} /> Live
                </a>
              )}
              <span className="ml-auto text-[10px] text-zinc-700">
                {new Date(project.created_at).toLocaleDateString("uz-UZ")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit}
              className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-800 hover:text-white transition-all"
              title="Tahrirlash">
              <Pencil size={14} />
            </button>
            <button onClick={onDelete}
              className="rounded-xl p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all"
              title="O'chirish">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────

const emptyPostForm = (): PostForm => ({
  title: "", slug: "", excerpt: "", content: "", cover_url: "", published: true,
});

const autoSlug = (v: string) => v.toLowerCase()
  .replace(/[^a-z0-9а-яё\u0400-\u04FF\u00C0-\u024F]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 120);

function BlogTab({ token }: { token: string }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [form, setForm] = useState<PostForm>(emptyPostForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/admin/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPosts(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const set = (k: keyof PostForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim() || form.content.trim().length < 10) {
      setErr("Sarlavha va matn (kamida 10 belgi) majburiy."); return;
    }
    setBusy(true); setErr("");
    const body = {
      title: form.title.trim(),
      slug: form.slug.trim() || autoSlug(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      cover_url: form.cover_url.trim() || null,
      published: form.published,
    };
    try {
      const url = editingId
        ? `/api/v1/admin/posts?id=${editingId}`
        : `/api/v1/admin/posts`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: authH(token), body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setErr(d.detail ?? "Xatolik."); return; }
      setForm(emptyPostForm()); setEditingId(null); fetchPosts();
    } catch { setErr("Tarmoq xatoligi."); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Postni o'chirish?")) return;
    await fetch(`/api/v1/admin/posts?id=${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    if (editingId === id) { setEditingId(null); setForm(emptyPostForm()); }
    fetchPosts();
  };

  const startEdit = (post: PostItem) => {
    setEditingId(post.id);
    setForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt,
      content: post.content, cover_url: post.cover_url ?? "", published: post.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-zinc-600" /></div>
      ) : (
        <>
          {/* Editor */}
          <div className="rounded-2xl border border-zinc-700/60 bg-[#141414] p-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
              {editingId ? "Postni tahrirlash" : "Yangi post"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Sarlavha</Label>
                <input placeholder="Portfolio uchun eng yaxshi Next.js sozlamalari"
                  value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
              </div>
              <div>
                <Label>Slug (avtomatik: sarlavhadan)</Label>
                <input placeholder="best-nextjs-config"
                  value={form.slug} onChange={(e) => set("slug", autoSlug(e.target.value))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <Label>Qisqa izoh (excerpt)</Label>
                <input placeholder="Postning 1-2 gap qisqacha tavsifi"
                  value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <Label>Cover rasm URL</Label>
                <input placeholder="https://images.unsplash.com/..."
                  value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <Label>Matn (bo'sh qatordan yangi paragraf)</Label>
                <textarea placeholder="Postning to'liq matni..."
                  value={form.content} onChange={(e) => set("content", e.target.value)}
                  rows={8} className={`${inputCls} resize-y`} />
              </div>
              <div className="sm:col-span-2">
                <button type="button" onClick={() => set("published", !form.published)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                    form.published ? "border-emerald-500/40 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900"
                  }`}>
                  <span className="text-sm font-medium text-white">
                    {form.published ? "Chop etilgan (sahifada ko'rinadi)" : "Qoralama (faqat admin ko'radi)"}
                  </span>
                  <div className={`flex h-5 w-9 items-center rounded-full transition-colors ${form.published ? "bg-emerald-500" : "bg-zinc-700"}`}>
                    <span className={`ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-4" : ""}`} />
                  </div>
                </button>
              </div>
            </div>

            {err && <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-2 text-xs text-red-400">{err}</p>}

            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleSubmit} disabled={busy}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-60 transition-all active:scale-[0.97]">
                {busy ? <Spinner /> : <Save size={14} />}
                {editingId ? "Saqlash" : "Yaratish"}
              </button>
              {editingId && (
                <button onClick={() => { setEditingId(null); setForm(emptyPostForm()); }}
                  className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 hover:text-white transition-all">
                  Bekor
                </button>
              )}
            </div>
          </div>

          {/* Post list */}
          <div className="space-y-3">
            {posts.length === 0 && (
              <p className="text-sm text-zinc-600">Hali post yo'q. Yuqoridagi forma orqali qo'shing.</p>
            )}
            {posts.map((post) => (
              <div key={post.id} className="group flex items-start gap-3 rounded-2xl border border-zinc-800 bg-[#111111] p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{post.title}</p>
                    {post.published
                      ? <Badge variant="green">Chop etilgan</Badge>
                      : <Badge variant="amber">Qoralama</Badge>}
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{post.excerpt}</p>
                  <p className="mt-0.5 text-[10px] text-zinc-700">
                    /blog/{post.slug} · {new Date(post.created_at).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => startEdit(post)}
                    className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-800 hover:text-white transition-all" title="Tahrirlash">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(post.id)}
                    className="rounded-xl p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all" title="O'chirish">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────

function SkillsTab({ token }: { token: string }) {
  const [items, setItems] = useState<SkillItem[]>([]);
  const [form, setForm] = useState<SkillForm>({ name: "", group: "", sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/admin/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems(await res.json());
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const set = (k: keyof SkillForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setErr("Nomi majburiy."); return; }
    setBusy(true); setErr("");
    try {
      const url = editingId ? `/api/v1/admin/skills?id=${editingId}` : `/api/v1/admin/skills`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: authH(token),
        body: JSON.stringify({ ...form, group: form.group.trim() || null }),
      });
      if (!res.ok) { const d = await res.json(); setErr(d.detail ?? "Xatolik."); return; }
      setForm({ name: "", group: "", sort_order: 0 }); setEditingId(null); fetchItems();
    } catch { setErr("Tarmoq xatoligi."); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Skillni o'chirish?")) return;
    await fetch(`/api/v1/admin/skills?id=${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="rounded-2xl border border-zinc-700/60 bg-[#141414] p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
          {editingId ? "Skillni tahrirlash" : "Yangi skill"}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Nomi</Label>
            <input placeholder="Python" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Guruh</Label>
            <input placeholder="Backend / Frontend / Database..." value={form.group}
              onChange={(e) => set("group", e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Tartib (0 = birinchi)</Label>
            <input type="number" min={0} value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))} className={inputCls} />
          </div>
        </div>
        {err && <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-2 text-xs text-red-400">{err}</p>}
        <div className="mt-4 flex items-center gap-3">
          <button onClick={handleSubmit} disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-60 transition-all active:scale-[0.97]">
            {busy ? <Spinner /> : <Save size={14} />}
            {editingId ? "Saqlash" : "Qo'shish"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ name: "", group: "", sort_order: 0 }); }}
              className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 hover:text-white transition-all">
              Bekor
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="group flex items-center gap-3 rounded-2xl border border-zinc-800 bg-[#111111] px-4 py-3">
            <Code2 size={14} className="shrink-0 text-zinc-600" />
            <p className="text-sm font-medium text-white">{item.name}</p>
            {item.group && <Badge variant="blue">{item.group}</Badge>}
            <span className="ml-auto text-[10px] text-zinc-700">#{item.sort_order}</span>
            <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingId(item.id); setForm({ name: item.name, group: item.group ?? "", sort_order: item.sort_order }); }}
                className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-800 hover:text-white transition-all"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)}
                className="rounded-xl p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-zinc-600">Hali skill yo'q.</p>}
      </div>
    </div>
  );
}

// ─── Experience Tab ───────────────────────────────────────────────────────────

const emptyExperienceForm = (): ExperienceForm => ({
  role: "", company: "", period: "", description: "", sort_order: 0,
});

function ExperienceTab({ token }: { token: string }) {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [form, setForm] = useState<ExperienceForm>(emptyExperienceForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/admin/experience`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems(await res.json());
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const set = (k: keyof ExperienceForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.role.trim() || !form.company.trim()) { setErr("Lavozim va kompaniya majburiy."); return; }
    setBusy(true); setErr("");
    try {
      const url = editingId ? `/api/v1/admin/experience?id=${editingId}` : `/api/v1/admin/experience`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: authH(token), body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setErr(d.detail ?? "Xatolik."); return; }
      setForm(emptyExperienceForm()); setEditingId(null); fetchItems();
    } catch { setErr("Tarmoq xatoligi."); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tajribani o'chirish?")) return;
    await fetch(`/api/v1/admin/experience?id=${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-700/60 bg-[#141414] p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
          {editingId ? "Tajribani tahrirlash" : "Yangi tajriba"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Lavozim</Label>
            <input placeholder="Backend Developer" value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Kompaniya / Tashkilot</Label>
            <input placeholder="Mustaqil web loyihalar" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Davr</Label>
            <input placeholder="2024 - Hozir" value={form.period} onChange={(e) => set("period", e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Tartib (0 = birinchi)</Label>
            <input type="number" min={0} value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <Label>Tavsif</Label>
            <textarea placeholder="Bu davrda nimalar qilgansiz..."
              value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={3} className={`${inputCls} resize-none`} />
          </div>
        </div>
        {err && <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-2 text-xs text-red-400">{err}</p>}
        <div className="mt-4 flex items-center gap-3">
          <button onClick={handleSubmit} disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-60 transition-all active:scale-[0.97]">
            {busy ? <Spinner /> : <Save size={14} />}
            {editingId ? "Saqlash" : "Qo'shish"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm(emptyExperienceForm()); }}
              className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 hover:text-white transition-all">
              Bekor
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="group flex items-start gap-3 rounded-2xl border border-zinc-800 bg-[#111111] p-4">
            <Briefcase size={14} className="mt-1 shrink-0 text-zinc-600" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">{item.role}</p>
                <Badge>#{item.sort_order}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-zinc-400">{item.company} · {item.period}</p>
              <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingId(item.id); setForm(item); }}
                className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-800 hover:text-white transition-all"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)}
                className="rounded-xl p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-zinc-600">Hali tajriba yo'q.</p>}
      </div>
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────

const emptyTestimonialForm = (): TestimonialForm => ({
  author: "", role: "", text: "", rating: 5, sort_order: 0,
});

function TestimonialsTab({ token }: { token: string }) {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [form, setForm] = useState<TestimonialForm>(emptyTestimonialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/admin/testimonials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems(await res.json());
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const set = (k: keyof TestimonialForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.author.trim() || form.text.trim().length < 10) { setErr("Muallif va matn (10+ belgi) majburiy."); return; }
    setBusy(true); setErr("");
    try {
      const url = editingId ? `/api/v1/admin/testimonials?id=${editingId}` : `/api/v1/admin/testimonials`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: authH(token),
        body: JSON.stringify({ ...form, role: form.role.trim() || null }),
      });
      if (!res.ok) { const d = await res.json(); setErr(d.detail ?? "Xatolik."); return; }
      setForm(emptyTestimonialForm()); setEditingId(null); fetchItems();
    } catch { setErr("Tarmoq xatoligi."); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Fikrni o'chirish?")) return;
    await fetch(`/api/v1/admin/testimonials?id=${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-700/60 bg-[#141414] p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
          {editingId ? "Fikrni tahrirlash" : "Yangi mijoz fikri"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Muallif</Label>
            <input placeholder="Aziza Karimova" value={form.author} onChange={(e) => set("author", e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Lavozim</Label>
            <input placeholder="Startup asoschisi" value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls} />
          </div>
          <div>
            <Label>Baho (1-5)</Label>
            <input type="number" min={1} max={5} value={form.rating}
              onChange={(e) => set("rating", Math.min(5, Math.max(1, Number(e.target.value))))} className={inputCls} />
          </div>
          <div>
            <Label>Tartib</Label>
            <input type="number" min={0} value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <Label>Fikr matni</Label>
            <textarea placeholder="Inomjon bilan ishlash ajoyib tajriba bo'ldi..."
              value={form.text} onChange={(e) => set("text", e.target.value)}
              rows={3} className={`${inputCls} resize-none`} />
          </div>
        </div>
        {err && <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-2 text-xs text-red-400">{err}</p>}
        <div className="mt-4 flex items-center gap-3">
          <button onClick={handleSubmit} disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-60 transition-all active:scale-[0.97]">
            {busy ? <Spinner /> : <Save size={14} />}
            {editingId ? "Saqlash" : "Qo'shish"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm(emptyTestimonialForm()); }}
              className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 hover:text-white transition-all">
              Bekor
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="group flex items-start gap-3 rounded-2xl border border-zinc-800 bg-[#111111] p-4">
            <MessageSquareQuote size={14} className="mt-1 shrink-0 text-zinc-600" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">{item.author}</p>
                {item.role && <Badge variant="blue">{item.role}</Badge>}
                <span className="text-[11px] text-amber-400">{"★".repeat(item.rating)}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 line-clamp-2">"{item.text}"</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingId(item.id); setForm({ author: item.author, role: item.role ?? "", text: item.text, rating: item.rating, sort_order: item.sort_order }); }}
                className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-800 hover:text-white transition-all"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)}
                className="rounded-xl p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-zinc-600">Hali fikrlar yo'q.</p>}
      </div>
    </div>
  );
}

// ─── Inbox Tab ────────────────────────────────────────────────────────────────

interface InboxMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  created_at: string;
}

function InboxTab({ token }: { token: string }) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/admin/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMessages(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchInbox(); }, [fetchInbox]);

  const handleDelete = async (id: string) => {
    if (!confirm("Xabarni o'chirish?")) return;
    await fetch(`/api/v1/admin/inbox?id=${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    fetchInbox();
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-zinc-600" /></div>;
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
        <InboxIcon size={32} className="mb-3 text-zinc-800" />
        <p className="text-sm font-medium text-zinc-600">Inbox bo'sh</p>
        <p className="mt-1 text-xs text-zinc-700">Kontakt formasi orqali xabar kelganda shu yerda ko'rinadi</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="group rounded-2xl border border-zinc-800 bg-[#111111] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">{msg.name}</p>
                <Badge variant="blue">{msg.subject}</Badge>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                <Mail size={11} /> {msg.email}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-[10px] text-zinc-700">
                {new Date(msg.created_at).toLocaleString("uz-UZ")}
              </span>
              <button onClick={() => handleDelete(msg.id)}
                className="rounded-xl p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                title="O'chirish">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{msg.body}</p>
          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
            <Phone size={11} /> Javob yozish
          </a>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [projects, setProjects]       = useState<Project[]>([]);
  const [tags, setTags]               = useState<TagItem[]>([]);
  const [analytics, setAnalytics]     = useState<AnalyticsData | null>(null);
  const [tab, setTab]                 = useState<"projects" | "tags" | "profile" | "blog" | "skills" | "experience" | "testimonials" | "inbox">("projects");
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Project | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/v1/projects?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setError("Loyihalarni yuklashda xatolik."); return; }
      setProjects(await res.json());
      setError("");
    } catch { setError("Tarmoq xatoligi."); }
    finally { setLoading(false); }
  }, [token]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND}/api/v1/admin/tags`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTags(await res.json());
    } catch { /* silently ignore */ }
  }, [token]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND}/api/v1/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAnalytics(await res.json());
    } catch { /* analytics must not block admin CRUD */ }
  }, [token]);

  useEffect(() => { fetchProjects(); fetchTags(); fetchAnalytics(); }, [fetchProjects, fetchTags, fetchAnalytics]);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Bu loyihani o'chirmoqchimisiz?")) return;
    await fetch(`${BACKEND}/api/v1/projects/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  const handleSaved = () => {
    setShowForm(false); setEditing(null); fetchProjects();
  };

  const openEdit = (p: Project) => {
    setShowForm(false); setEditing(p);
  };

  const tabs = [
    { key: "projects" as const, label: "Loyihalar", icon: <FolderKanban size={13} /> },
    { key: "blog" as const, label: "Blog", icon: <FileText size={13} /> },
    { key: "skills" as const, label: "Skillar", icon: <Code2 size={13} /> },
    { key: "experience" as const, label: "Tajriba", icon: <Briefcase size={13} /> },
    { key: "testimonials" as const, label: "Fikrlar", icon: <MessageSquareQuote size={13} /> },
    { key: "tags" as const, label: "Teglar", icon: <Tag size={13} /> },
    { key: "inbox" as const, label: "Inbox", icon: <InboxIcon size={13} /> },
    { key: "profile" as const, label: "Profil", icon: <User size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-zinc-800">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">Admin Panel</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Portfolio boshqaruvi</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 px-3 py-2 text-xs text-zinc-400 hover:border-red-500/40 hover:text-red-400 transition-all">
            <LogOut size={13} /> Chiqish
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Jami loyihalar", value: projects.length, color: "text-white" },
            { label: "Featured",       value: projects.filter((p) => p.featured).length, color: "text-amber-400" },
            { label: "Teglar",         value: tags.length, color: "text-blue-400" },
            { label: "Kirishlar",      value: analytics?.total_visits ?? 0, color: "text-emerald-400" },
            { label: "Bugun",          value: analytics?.today_visits ?? 0, color: "text-cyan-400" },
            { label: "Visitorlar",     value: analytics?.unique_visitors ?? 0, color: "text-violet-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 px-5 py-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-xs text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>

        {analytics && (
          <div className="mb-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Oxirgi kirishlar</p>
                <p className="mt-0.5 text-xs text-zinc-600">Portfolio ochilganda avtomatik yoziladi</p>
              </div>
              <button
                onClick={fetchAnalytics}
                className="rounded-xl border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
              >
                Yangilash
              </button>
            </div>

            {/* 7-day chart */}
            {analytics.daily_visits.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  So'nggi 7 kun
                </p>
                <div className="flex h-28 items-end gap-2">
                  {analytics.daily_visits.map((row) => {
                    const max = Math.max(...analytics.daily_visits.map((r) => r.count), 1);
                    const height = Math.max(6, Math.round((row.count / max) * 100));
                    return (
                      <div key={row.day} className="flex flex-1 flex-col items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-zinc-400">{row.count}</span>
                        <div
                          className="w-full rounded-md bg-emerald-500/70 transition-all hover:bg-emerald-400"
                          style={{ height: `${height}%`, maxHeight: "92px" }}
                          title={`${row.day}: ${row.count}`}
                        />
                        <span className="text-[9px] text-zinc-600">{row.day.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top pages */}
            {analytics.page_visits.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Top sahifalar (30 kun)
                </p>
                <div className="space-y-2">
                  {analytics.page_visits.map((row) => {
                    const max = Math.max(...analytics.page_visits.map((r) => r.count), 1);
                    const width = Math.max(4, Math.round((row.count / max) * 100));
                    return (
                      <div key={row.path} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 truncate text-xs text-zinc-400">{row.path}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
                          <div className="h-full rounded-full bg-cyan-500/70" style={{ width: `${width}%` }} />
                        </div>
                        <span className="w-6 text-right text-xs font-semibold text-zinc-300">{row.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {analytics.recent_visits.length === 0 ? (
              <p className="text-sm text-zinc-600">Hali kirishlar yo'q.</p>
            ) : (
              <div className="space-y-2">
                {analytics.recent_visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex flex-col gap-1 rounded-xl border border-zinc-800 bg-[#111111] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-200">{visit.visitor_label}</p>
                      <p className="truncate text-xs text-zinc-600">{visit.path}</p>
                    </div>
                    <p className="shrink-0 text-xs text-zinc-600">
                      {new Date(visit.created_at).toLocaleString("uz-UZ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-white/8 text-white shadow-sm border border-zinc-700/60"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}>
              {t.icon} {t.label}
              {t.key === "projects" && projects.length > 0 && (
                <span className="ml-auto mr-1 rounded-md bg-zinc-700/60 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                  {projects.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Projects tab ── */}
        {tab === "projects" && (
          <div className="space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {loading ? "Yuklanmoqda..." : `${projects.length} ta loyiha`}
              </p>
              {!showForm && !editing && (
                <button onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 transition-all active:scale-[0.97]">
                  <Plus size={13} /> Yangi loyiha
                </button>
              )}
            </div>

            {/* Add / Edit form */}
            {(showForm || editing) && (
              <ProjectFormPanel
                token={token} tags={tags}
                initial={editing ?? undefined}
                onSaved={handleSaved}
                onCancel={() => { setShowForm(false); setEditing(null); }}
              />
            )}

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={28} className="animate-spin text-zinc-700" />
                <p className="text-sm text-zinc-600">Yuklanmoqda...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
                <FolderKanban size={32} className="mb-3 text-zinc-800" />
                <p className="text-sm font-medium text-zinc-600">Hali loyihalar yo'q</p>
                <p className="mt-1 text-xs text-zinc-700">Yuqoridagi tugma orqali birinchi loyihani qo'shing</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <ProjectCard
                    key={p.id} project={p}
                    onEdit={() => openEdit(p)}
                    onDelete={() => handleDeleteProject(p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tags tab ── */}
        {tab === "tags" && (
          <TagManager token={token} tags={tags} onTagsChange={fetchTags} />
        )}

        {/* ── Blog tab ── */}
        {tab === "blog" && <BlogTab token={token} />}

        {/* ── Skills tab ── */}
        {tab === "skills" && <SkillsTab token={token} />}

        {/* ── Experience tab ── */}
        {tab === "experience" && <ExperienceTab token={token} />}

        {/* ── Testimonials tab ── */}
        {tab === "testimonials" && <TestimonialsTab token={token} />}

        {/* ── Inbox tab ── */}
        {tab === "inbox" && <InboxTab token={token} />}

        {/* ── Profile tab ── */}
        {tab === "profile" && (
          <ProfileEditor token={token} />
        )}
      </main>
    </div>
  );
}
