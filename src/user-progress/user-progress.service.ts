// ...existing code...

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async markLearned(
    userId: string,
    itemId: string,
    itemType: 'HIRAGANA' | 'KATAKANA' | 'KANJI' | 'VOCAB',
  ) {
    console.log('markLearned called with:', { userId, itemId, itemType });
    if (!userId) throw new Error('userId is required');
    return this.prisma.userProgress.upsert({
      where: {
        userId_itemId_itemType: {
          userId: userId,
          itemId: itemId,
          itemType: itemType,
        },
      },
      update: { learned: true },
      create: { userId, itemId, itemType, learned: true },
    });
  }

  async markNotLearned(
    userId: string,
    itemId: string,
    itemType: 'HIRAGANA' | 'KATAKANA' | 'KANJI' | 'VOCAB',
  ) {
    if (!userId) throw new Error('userId is required');
    return this.prisma.userProgress.upsert({
      where: {
        userId_itemId_itemType: {
          userId: userId,
          itemId: itemId,
          itemType: itemType,
        },
      },
      update: { learned: false },
      create: { userId, itemId, itemType, learned: false },
    });
  }

  async setBookmark(
    userId: string,
    itemId: string,
    itemType: 'HIRAGANA' | 'KATAKANA' | 'KANJI' | 'VOCAB',
    value: boolean,
  ) {
    if (!userId) throw new Error('userId is required');
    return this.prisma.userProgress.upsert({
      where: {
        userId_itemId_itemType: {
          userId: userId,
          itemId: itemId,
          itemType: itemType,
        },
      },
      update: { bookmarked: value },
      create: { userId, itemId, itemType, bookmarked: value },
    });
  }

  async getLearned(userId: string) {
    return this.prisma.userProgress.findMany({
      where: { userId, learned: true },
    });
  }
}
