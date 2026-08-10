import { NextResponse } from "next/server";
import { getExperienceViews } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getExperienceViews());
}