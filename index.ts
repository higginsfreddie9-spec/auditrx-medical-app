import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import AuditDetailClient from "@/components/AuditDetailClient";
import type { AuditResult, Discrepancy } from "@/lib/types";

export const metadata: Metadata = {
  robots: { index: false, follow: false }, // audit results are private, never indexed
};

export default async function AuditDetailPage({ params }: { params: { id: string } }) {
  const auditSession = await prisma.auditSession.findUnique({
    where: { id: params.id },
    include: { orders: true },
  });

  if (!auditSession) notFound();

  const isUnlocked = auditSession.orders.some((o) => o.status === "PAID");
  const session = await getSession();

  const result: AuditResult = {
    providerName: auditSession.providerName,
    statementDate: auditSession.statementDate,
    discrepancies: auditSession.discrepancies as unknown as Discrepancy[],
    totalBilled: auditSession.totalBilled,
    totalCorrected: auditSession.totalCorrected,
    potentialSavings: auditSession.potentialSavings,
  };

  return (
    <AuditDetailClient
      auditId={auditSession.id}
      initialResult={result}
      initialLetter={isUnlocked ? auditSession.letterText : null}
      initialUnlocked={isUnlocked}
      defaultEmail={session?.email}
    />
  );
}
