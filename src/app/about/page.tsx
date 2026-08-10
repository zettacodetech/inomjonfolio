import { AboutContent } from "@/components/about/AboutContent";
import {
  getExperienceViews,
  getPortfolioStats,
  getSkillViews,
  getTestimonialViews,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About | Inomjon Toshmirzayev",
  description: "Backend Developer from Qashqadaryo, Uzbekistan.",
};

export default async function AboutPage() {
  const [stats, skills, experience, testimonials] = await Promise.all([
    getPortfolioStats(),
    getSkillViews(),
    getExperienceViews(),
    getTestimonialViews(),
  ]);

  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <AboutContent
          stats={stats}
          skills={skills}
          experience={experience}
          testimonials={testimonials}
        />
      </div>
    </main>
  );
}
