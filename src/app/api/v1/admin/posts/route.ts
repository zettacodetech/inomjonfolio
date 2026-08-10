import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import { createPost, deletePost, listPosts, updatePost, findPost } from "@/lib/portfolio-db";
import { serializePost } from "@/lib/portfolio-serializers";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\u00C0-\u024F]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

type PostInput = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_url?: string;
  published?: boolean;
};

function parseInput(body: PostInput) {
  const title = body.title?.trim() ?? "";
  const content = body.content?.trim() ?? "";
  if (title.length < 2 || content.length < 10) return null;
  return {
    title,
    slug: slugify(body.slug ?? title) || slugify(title),
    excerpt: body.excerpt?.trim() ?? "",
    content,
    coverUrl: body.cover_url?.trim() || null,
    published: Boolean(body.published),
  };
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const posts = await listPosts(true);
  return NextResponse.json(posts.map(serializePost));
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const input = parseInput((await request.json().catch(() => ({}))) as PostInput);
  if (!input) {
    return NextResponse.json({ detail: "Sarlavha va matnni to'liq kiriting." }, { status: 400 });
  }
  const post = await createPost(input);
  return NextResponse.json(post ? serializePost(post) : null, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });

  const input = parseInput((await request.json().catch(() => ({}))) as PostInput);
  if (!input) {
    return NextResponse.json({ detail: "Sarlavha va matnni to'liq kiriting." }, { status: 400 });
  }
  const existing = await findPost(id, true);
  if (!existing) return NextResponse.json({ detail: "Post topilmadi." }, { status: 404 });
  const post = await updatePost(id, input);
  return NextResponse.json(post ? serializePost(post) : null);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  await deletePost(id);
  return NextResponse.json({ ok: true });
}