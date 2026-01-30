// update_kanji_jlptLevel.js
// Usage: node update_kanji_jlptLevel.js
// Updates all Kanji.jlptLevel values to be 'N5', 'N4', etc. instead of '5', '4', etc.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JLPT_MAP = {
  '1': 'N1',
  '2': 'N2',
  '3': 'N3',
  '4': 'N4',
  '5': 'N5',
  1: 'N1',
  2: 'N2',
  3: 'N3',
  4: 'N4',
  5: 'N5',
};

async function main() {
  const kanjiList = await prisma.kanji.findMany();
  let updated = 0;
  for (const kanji of kanjiList) {
    const current = kanji.jlptLevel;
    if (JLPT_MAP[current]) {
      await prisma.kanji.update({
        where: { id: kanji.id },
        data: { jlptLevel: JLPT_MAP[current] },
      });
      updated++;
    }
  }
  console.log(`Updated ${updated} kanji records.`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
