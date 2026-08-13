import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import type { AuditResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { result?: AuditResult; letter?: string } | null;

  if (!body?.result || !body.letter) {
    return NextResponse.json({ error: "Missing audit result or letter." }, { status: 400 });
  }

  const session = await getSession();

  const auditSession = await prisma.auditSession.create({
    data: {
      userId: session?.userId,
      providerName: body.result.providerName,
      statementDate: body.result.statementDate,
      discrepancies: body.result.discrepancies as unknown as object,
      totalBilled: body.result.totalBilled,
      totalCorrected: body.result.totalCorrected,
      potentialSavings: body.result.potentialSavings,
      letterText: body.letter,
    },
  });

  return NextResponse.json({ id: auditSession.id });
}
