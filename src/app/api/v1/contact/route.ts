import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendContactNotificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ detail: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "Portfolio aloqa";
  const message = body.message?.trim() ?? "";

  if (!name || !email || message.length < 5) {
    return NextResponse.json({ detail: "Ism, email va xabar majburiy." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ detail: "Email noto'g'ri." }, { status: 400 });
  }

  try {
    await prisma.$executeRaw`
      INSERT OR IGNORE INTO User (id, email, passwordHash, role, createdAt)
      VALUES ('contact-inbox', 'contact@inbox.local', 'x', 'SYSTEM', datetime('now'))
    `;
    await prisma.$executeRaw`
      INSERT INTO Message (id, name, email, subject, body, userId, createdAt)
      VALUES (${randomUUID()}, ${name}, ${email}, ${subject}, ${message}, 'contact-inbox', datetime('now'))
    `;
  } catch {
    return NextResponse.json({ detail: "Xabarni saqlashda xatolik." }, { status: 500 });
  }

  try {
    await sendContactNotificationEmail({ name, email, subject, body: message });
  } catch (error) {
    console.error("Contact notification email failed:", error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}