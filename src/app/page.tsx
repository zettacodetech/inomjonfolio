import { HeroSection } from "@/components/home/HeroSection";
import { ProfileCard } from "@/components/home/ProfileCard";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SkillsMarquee } from "@/components/home/SkillsMarquee";
import { Parallax } from "@/components/effects/Parallax";
import { getPortfolioStats, getSkillViews, getTestimonialViews } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [testimonials, stats, skills] = await Promise.all([
    getTestimonialViews(),
    getPortfolioStats(),
    getSkillViews(),
  ]);

  return (
    <main className="relative min-h-screen px-4 pt-28 pb-16">
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <HeroSection />
          <ProfileCard stats={stats} />
        </div>
        <Parallax distance={40}>
          <SkillsMarquee skills={skills} />
        </Parallax>
        <Parallax distance={80}>
          <TestimonialsSection testimonials={testimonials} />
        </Parallax>
      </div>
    </main>
  );
}
