"use client";

import { motion, type Transition } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { ContactForm } from "./ContactForm";

const ft = (delay = 0): Transition => ({ duration: 0.5, ease: "easeOut", delay });

interface ContactInfo {
  phone: string;
  email: string;
  location: string;
  telegram: string | null;
  github: string | null;
}

export function ContactPageClient({ contactInfo }: { contactInfo: ContactInfo }) {
  const { t } = useLanguage();

  const cards = [
    { icon: Phone, label: t.phoneLabel,    value: contactInfo.phone },
    { icon: Mail,  label: t.emailLabel,    value: contactInfo.email },
    { icon: MapPin, label: t.locationLabel, value: contactInfo.location },
  ];

  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ft(0)}
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500"
          >
            {t.getInTouch}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ft(0.07)}
            className="mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-4xl"
          >
            {t.contactHeadline}
          </motion.h1>
        </div>

        {/* Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Info cards */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={ft(0)}
              className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500"
            >
              {t.contactInfoLabel}
            </motion.p>
            <div className="flex flex-col gap-3">
              {cards.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={ft(0.07 * i)}
                  className="card-luxe shine group relative flex items-center gap-4 overflow-hidden rounded-2xl p-4"
                >
                  <div className="orb -left-10 -top-10 h-24 w-24 bg-[#999999]/15 dark:bg-[#999999]/10" />
                  <div className="ring-chrome relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 dark:border-white/[0.08] transition-transform duration-300 group-hover:scale-110">
                    <Icon size={16} className="text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-white">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
