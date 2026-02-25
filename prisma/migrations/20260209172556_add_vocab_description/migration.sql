/*
  Warnings:

  - A unique constraint covering the columns `[word,furigana]` on the table `Vocabulary` will be added. If there are existing duplicate values, this will fail.
  - Made the column `furigana` on table `Vocabulary` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Vocabulary_word_level_key";

-- AlterTable
ALTER TABLE "Vocabulary" ADD COLUMN     "description" TEXT,
ALTER COLUMN "furigana" SET NOT NULL;

-- CreateTable
CREATE TABLE "Kanji" (
    "id" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "onyomi" TEXT[],
    "kunyomi" TEXT[],
    "strokes" INTEGER NOT NULL,
    "jlptLevel" TEXT NOT NULL,
    "radicals" TEXT[],
    "status" TEXT,
    "reviewCount" INTEGER,
    "isBookmarked" BOOLEAN NOT NULL DEFAULT false,
    "examples" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kanji_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kanji_character_key" ON "Kanji"("character");

-- CreateIndex
CREATE UNIQUE INDEX "Vocabulary_word_furigana_key" ON "Vocabulary"("word", "furigana");
