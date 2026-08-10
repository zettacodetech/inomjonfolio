import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial,
} from "@/lib/portfolio-db";
import { serializeTestimonial } from "@/lib/portfolio-serializers";

export const dynamic = "force-dynamic";

type TestimonialInput = {
  author?: string;
  role?: string;
  text?: string;
  rating?: number;
  sort_order?: number;
};

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parseInput(body: TestimonialInput) {
  const author = text(body.author);
  const testimonialText = text(body.text);
  if (!author || !testimonialText) return null;
  const rating = Number.isFinite(Number(body.rating))
    ? Math.min(5, Math.max(1, Math.trunc(Number(body.rating))))
    : 5;
  const sortOrder = Number.isFinite(Number(body.sort_order))
    ? Math.max(0, Math.trunc(Number(body.sort_order)))
    : 0;
  return {
    author,
    role: text(body.role),
    text: testimonialText,
    rating,
    sortOrder,
  };
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const items = await listTestimonials();
  return NextResponse.json(items.map(serializeTestimonial));
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const input = parseInput((await request.json().catch(() => ({}))) as TestimonialInput);
  if (!input) {
    return NextResponse.json({ detail: "Muallif va matn majburiy." }, { status: 400 });
  }
  await createTestimonial(input);
  const items = await listTestimonials();
  return NextResponse.json(items.map(serializeTestimonial), { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  const input = parseInput((await request.json().catch(() => ({}))) as TestimonialInput);
  if (!input) {
    return NextResponse.json({ detail: "Muallif va matn majburiy." }, { status: 400 });
  }
  await updateTestimonial(id, input);
  const items = await listTestimonials();
  return NextResponse.json(items.map(serializeTestimonial));
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  await deleteTestimonial(id);
  const items = await listTestimonials();
  return NextResponse.json(items.map(serializeTestimonial));
}