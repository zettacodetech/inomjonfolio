import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  createdAt: string;
};

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const rows = await prisma.$queryRaw<MessageRow[]>`
    SELECT id, name, email, subject, body, CAST(createdAt AS TEXT) AS createdAt
    FROM Message
    ORDER BY createdAt DESC
    LIMIT 200
  `;
  return NextResponse.json(rows);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ detail: "Ruxsat yo'q." }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id kerak." }, { status: 400 });
  await prisma.$executeRaw`DELETE FROM Message WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}