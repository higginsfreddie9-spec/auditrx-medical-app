// Prisma schema for AuditRx AI.
// Run `npx prisma migrate dev --name init` after setting DATABASE_URL.
// Postgres is assumed (works on Supabase/Neon/RDS); swap the provider
// below if you're using something else.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())

  auditSessions AuditSession[]
  orders        Order[]
}

model AuditSession {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])

  providerName     String
  statementDate    String
  discrepancies    Json     // Discrepancy[] — see lib/types.ts
  totalBilled      Float
  totalCorrected   Float
  potentialSavings Float
  letterText       String   @db.Text

  createdAt DateTime @default(now())
  orders    Order[]

  @@index([userId])
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentProviderName {
  STRIPE
  PAYSTACK
  FLUTTERWAVE
}

model Order {
  id             String              @id @default(cuid())
  auditSessionId String
  auditSession   AuditSession        @relation(fields: [auditSessionId], references: [id])
  userId         String?
  user           User?               @relation(fields: [userId], references: [id])

  provider       PaymentProviderName
  providerRef    String              @unique // checkout session id / transaction reference
  amountCents    Int
  currency       String              @default("USD")
  status         OrderStatus         @default(PENDING)

  createdAt DateTime  @default(now())
  paidAt    DateTime?

  @@index([auditSessionId])
  @@index([providerRef])
}
