// Script to import multiple kanji JSON files into the kanji table using Prisma ORM
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const kanjiFiles = [
  '../../japanese-frontend-main/src/assets/Kanji_N5.json',
  '../../japanese-frontend-main/src/assets/Kanji_N4.json',
  '../../japanese-frontend-main/src/assets/Kanji_N3.json',
  '../../japanese-frontend-main/src/assets/Kanji_N2.json'
];

async function main() {
  for (const file of kanjiFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    const kanjiData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const entry of kanjiData) {
      try {
        // Normalize JLPT level to 'N5', 'N4', 'N3', 'N2' string
        let jlptLevel = entry.jlptLevel;
        if (typeof jlptLevel === 'number' || /^[0-9]$/.test(jlptLevel)) {
          jlptLevel = `N${jlptLevel}`;
        }
        jlptLevel = String(jlptLevel).toUpperCase();
        await prisma.kanji.create({
          data: {
            character: entry.character,
            meaning: entry.meaning,
            onyomi: entry.onyomi || [],
            kunyomi: entry.kunyomi || [],
            strokes: entry.strokes,
            jlptLevel,
            radicals: entry.radicals || [],
            status: entry.status || null,
            reviewCount: entry.reviewCount || null,
            isBookmarked: entry.isBookmarked || false,
            examples: entry.examples || [],
          },
        });
        console.log(`Imported kanji: ${entry.character}`);
      } catch (err) {
        if (err.code === 'P2002') {
          console.warn(`Duplicate kanji skipped: ${entry.character}`);
        } else {
          console.error(`Error importing kanji ${entry.character}:`, err.message);
        }
      }
    }
  }
  await prisma.$disconnect();
}

main();
