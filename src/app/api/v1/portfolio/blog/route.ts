import { NextResponse } from "next/server";
import { getPostViews, getExperienceViews, getTestimonialViews } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const [posts, experience, testimonials] = await Promise.all([
    getPostViews(false),
    getExperienceViews(),
    getTestimonialViews(),
  ]);
  return NextResponse.json({ posts, experience, testimonials });
}