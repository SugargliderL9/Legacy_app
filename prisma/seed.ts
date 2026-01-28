import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.count();
  if (existing > 0) {
    console.log("Users already exist, skipping seed.");
    return;
  }

  await prisma.user.createMany({
    data: [
      { username: "admin", passwordHash: await bcrypt.hash("admin", 10) },
      { username: "user1", passwordHash: await bcrypt.hash("user1", 10) },
      { username: "user2", passwordHash: await bcrypt.hash("user2", 10) },
    ],
  });

  await prisma.project.createMany({
    data: [
      { name: "Proyecto Demo", description: "Proyecto de ejemplo" },
      { name: "Proyecto Alpha", description: "Proyecto importante" },
      { name: "Proyecto Beta", description: "Proyecto secundario" },
    ],
  });

  console.log("Seed done.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
