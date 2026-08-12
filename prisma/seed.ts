/**
 * OPTIONAL demo seed data for local development.
 *
 * This script is completely separate from application logic — nothing here
 * is imported by the app itself. It exists purely to populate a demo account
 * so the dashboard looks alive while you develop. Safe to delete this file
 * (and the `migrations.seed` line in prisma.config.ts) at any time.
 *
 * Run with: npm run db:seed
 * Demo login: demo@leadloop.app / demo12345
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@leadloop.app";
const DEMO_PASSWORD = "demo12345";

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding demo data for LeadLoop…");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      name: "Demo Owner",
      email: DEMO_EMAIL,
      passwordHash,
    },
  });

  // Reset this demo account's leads so the script is safely re-runnable.
  await prisma.lead.deleteMany({ where: { userId: user.id } });

  const johnLead = await prisma.lead.create({
    data: {
      userId: user.id,
      customerName: "John Smith",
      phone: "(555) 201-4488",
      email: "john.smith@example.com",
      service: "Full Detail — Tesla Model 3",
      estimatedValue: 200,
      status: "FOLLOW_UP",
      notes: "Mentioned he'd also like a quote for ceramic coating.",
      lastContactedAt: daysFromNow(-3),
      nextFollowUpAt: daysFromNow(0),
    },
  });

  await prisma.followUp.create({
    data: {
      leadId: johnLead.id,
      type: "GENERATED_MESSAGE",
      message:
        "Hey John! Just checking in about the Tesla Model 3 detail we talked about. I still have some availability this week if you'd like to get scheduled.",
      createdAt: daysFromNow(-1),
    },
  });

  await prisma.lead.create({
    data: {
      userId: user.id,
      customerName: "Sarah Williams",
      phone: "(555) 340-9021",
      email: "sarah.williams@example.com",
      service: "Interior Detail — BMW X5",
      estimatedValue: 150,
      status: "NEW",
      notes: "Referred by a friend, mentioned she's flexible on timing.",
      nextFollowUpAt: daysFromNow(1),
    },
  });

  await prisma.lead.create({
    data: {
      userId: user.id,
      customerName: "Mike Johnson",
      phone: "(555) 118-7732",
      email: "mike.johnson@example.com",
      service: "Full Detail — Ford F-150",
      estimatedValue: 250,
      status: "CONTACTED",
      notes: "Asked about pricing for a fleet of 3 trucks.",
      lastContactedAt: daysFromNow(-5),
      nextFollowUpAt: daysFromNow(-2),
    },
  });

  console.log(`Seed complete. Log in with ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
