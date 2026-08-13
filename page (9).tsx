import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createMagicLinkToken } from "@/lib/auth/magic-link";
import { sendEmail } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));

  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Upsert so returning users don't create duplicate accounts, and new
  // users don't need a separate "sign up" step — passwordless auth means
  // sign-in and sign-up are the same action.
  await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: { email: normalizedEmail },
  });

  const token = await createMagicLinkToken(normalizedEmail);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const link = `${siteUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: normalizedEmail,
    subject: "Sign in to AuditRx AI",
    html: `
      <p>Click below to sign in. This link expires in 15 minutes.</p>
      <p><a href="${link}">Sign in to AuditRx AI</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });

  // Always return the same response whether or not the email exists in the
  // system (it always will, due to the upsert) — avoids leaking account
  // existence and gives no useful signal to an attacker either way.
  return NextResponse.json({ ok: true });
}
