import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auditSession = await prisma.auditSession.findUnique({
    where: { id: params.id },
    include: { orders: true },
  });

  if (!auditSession) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Unlock status is derived from the database, never from anything the
  // client asserts — this is what makes the paywall actually enforceable.
  const isUnlocked = auditSession.orders.some((o) => o.status === "PAID");

  return NextResponse.json({
    id: auditSession.id,
    providerName: auditSession.providerName,
    statementDate: auditSession.statementDate,
    discrepancies: auditSession.discrepancies,
    totalBilled: auditSession.totalBilled,
    totalCorrected: auditSession.totalCorrected,
    potentialSavings: auditSession.potentialSavings,
    letterText: isUnlocked ? auditSession.letterText : null,
    isUnlocked,
    createdAt: auditSession.createdAt,
  });
}
