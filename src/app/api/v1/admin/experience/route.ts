import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  createExperience,
  deleteExperience,
  listExperience,
  updateExperience,
} from "@/lib/portfolio-db";
import { serializeExperience } from "@/lib/portfolio-serializers";

export const dynamic = "force-dynamic";

type ExperienceInput = {
  role?: string;
  company?: string;
  period?: string;
  description?: string;
  sort_order?: number;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseInput(body: ExperienceInput) {
  const role = text(body.role);
  const company = text(body.company);
  const description = text(body.description);
  if (!role || !company) return null;
  const sortOrder = Number.isFinite(Number(body.sort_order))
    ? Math.max(0, Math.trunc(Number(body.sort_order)))
    : 0;
  return {
    role,
    company,
    period: text(body.period),
    description,
    sortOrder,
  };
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const items = await listExperience();
  return NextResponse.json(items.map(serializeExperience));
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const input = parseInput((await request.json().catch(() => ({}))) as ExperienceInput);
  if (!input) {
    return NextResponse.json({ detail: "Lavozim va kompaniya majburiy." }, { status: 400 });
  }
  await createExperience(input);
  const items = await listExperience();
  return NextResponse.json(items.map(serializeExperience), { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  const input = parseInput((await request.json().catch(() => ({}))) as ExperienceInput);
  if (!input) {
    return NextResponse.json({ detail: "Lavozim va kompaniya majburiy." }, { status: 400 });
  }
  await updateExperience(id, input);
  const items = await listExperience();
  return NextResponse.json(items.map(serializeExperience));
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  await deleteExperience(id);
  const items = await listExperience();
  return NextResponse.json(items.map(serializeExperience));
}