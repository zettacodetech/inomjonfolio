"use client";

import type { SkillView } from "@/lib/data";
import { Marquee } from "@/components/effects/Marquee";

export function SkillsMarquee({ skills }: { skills: SkillView[] }) {
  if (skills.length === 0) return null;

  return (
    <div className="mt-24">
      <Marquee speed={40}>
        {skills.map((skill) => (
          <span key={skill.id} className="chip-3d shrink-0 px-5 py-2.5 text-sm">
            {skill.name}
          </span>
        ))}
      </Marquee>
    </div>
  );
}