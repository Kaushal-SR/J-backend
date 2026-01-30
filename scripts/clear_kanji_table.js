// Script to clear all kanji from the kanji table using Prisma ORM
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.kanji.deleteMany({});
  console.log(`Deleted ${deleted.count} kanji from the database.`);
  await prisma.$disconnect();
}

main();
