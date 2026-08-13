import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import { createSessionCookie } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/login?error=missing_token`);
  }

  const email = await verifyMagicLinkToken(token);
  if (!email) {
    return NextResponse.redirect(`${siteUrl}/login?error=expired_link`);
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  await createSessionCookie({ userId: user.id, email: user.email });

  return NextResponse.redirect(`${siteUrl}/dashboard`);
}
