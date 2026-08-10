import { NextRequest, NextResponse } from "next/server";
import { findPost } from "@/lib/portfolio-db";
import { serializePost } from "@/lib/portfolio-serializers";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await findPost(slug, false);
  if (!post) {
    return NextResponse.json({ detail: "Post topilmadi." }, { status: 404 });
  }
  return NextResponse.json(serializePost(post));
}