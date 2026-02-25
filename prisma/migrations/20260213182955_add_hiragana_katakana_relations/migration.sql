-- RenameForeignKey
ALTER TABLE "UserProgress" RENAME CONSTRAINT "UserProgress_itemId_fkey" TO "UserProgress_itemId_fkey_vocabulary";

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_itemId_fkey_hiragana" FOREIGN KEY ("itemId") REFERENCES "Hiragana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_itemId_fkey_katakana" FOREIGN KEY ("itemId") REFERENCES "Katakana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
