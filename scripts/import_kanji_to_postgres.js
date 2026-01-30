// Script to import Kanji_N5.json into the kanji table using Prisma ORM
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const kanjiJsonPath = path.join(__dirname, '../../japanese-frontend-main/src/assets/Kanji_N5.json');
  const kanjiData = JSON.parse(fs.readFileSync(kanjiJsonPath, 'utf8'));

  for (const entry of kanjiData) {
    try {
      await prisma.kanji.create({
        data: {
          character: entry.character,
          meaning: entry.meaning,
          onyomi: entry.onyomi || [],
          kunyomi: entry.kunyomi || [],
          strokes: entry.strokes,
          jlptLevel: entry.jlptLevel,
          radicals: entry.radicals || [],
          status: entry.status || null,
          reviewCount: entry.reviewCount || null,
          isBookmarked: entry.isBookmarked || false,
          examples: entry.examples || [],
        },
      });
      console.log(`Imported kanji: ${entry.character}`);
    } catch (err) {
      console.error(`Error importing kanji ${entry.character}:`, err.message);
    }
  }
  await prisma.$disconnect();
}

main();
