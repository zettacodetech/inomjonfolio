import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  createSkill,
  deleteSkill,
  listSkills,
  updateSkill,
} from "@/lib/portfolio-db";
import { serializeSkill } from "@/lib/portfolio-serializers";

export const dynamic = "force-dynamic";

type SkillInput = {
  name?: string;
  group?: string;
  sort_order?: number;
};

function parseInput(body: SkillInput) {
  const name = body.name?.trim() ?? "";
  if (name.length < 1) return null;
  const sortOrder = Number.isFinite(Number(body.sort_order))
    ? Math.max(0, Math.trunc(Number(body.sort_order)))
    : 0;
  return {
    name,
    group: typeof body.group === "string" && body.group.trim() ? body.group.trim() : null,
    sortOrder,
  };
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const items = await listSkills();
  return NextResponse.json(items.map(serializeSkill));
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const input = parseInput((await request.json().catch(() => ({}))) as SkillInput);
  if (!input) {
    return NextResponse.json({ detail: "Skill nomi majburiy." }, { status: 400 });
  }
  await createSkill(input);
  const items = await listSkills();
  return NextResponse.json(items.map(serializeSkill), { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  const input = parseInput((await request.json().catch(() => ({}))) as SkillInput);
  if (!input) {
    return NextResponse.json({ detail: "Skill nomi majburiy." }, { status: 400 });
  }
  await updateSkill(id, input);
  const items = await listSkills();
  return NextResponse.json(items.map(serializeSkill));
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  await deleteSkill(id);
  const items = await listSkills();
  return NextResponse.json(items.map(serializeSkill));
}