"use client";

import { useState } from "react";
import { motion, type Transition } from "framer-motion";
import { Send } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      window.dispatchEvent(new CustomEvent("burst-confetti", { detail: { x: window.innerWidth / 2, y: window.innerHeight * 0.4 } }));
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-[#999999]/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(153,153,153,0.12)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#999999]/50 dark:focus:bg-white/[0.05] dark:focus:shadow-[0_0_0_3px_rgba(153,153,153,0.08)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 } as Transition}
      className="card-luxe shine relative overflow-hidden rounded-2xl p-6"
    >
      <div className="orb -right-14 -top-14 h-36 w-36 bg-[#999999]/15 dark:bg-[#999999]/10" />
      <p className="relative z-10 mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
        {t.sendLabel}
      </p>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder={t.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <input
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <textarea
          rows={5}
          placeholder={t.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={status === "sending"}
        className="relative z-10 mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gradient-to-b dark:from-white dark:to-zinc-200 dark:text-black dark:hover:from-zinc-50 dark:hover:to-zinc-300"
      >
        {status === "idle" && (
          <>
            <Send size={14} />
            {t.sendBtn}
          </>
        )}
        {status === "sending" && t.sending}
        {status === "sent" && t.sent}
        {status === "error" && "Xatolik yuz berdi. Qayta urinib ko'ring."}
      </button>
    </motion.div>
  );
}