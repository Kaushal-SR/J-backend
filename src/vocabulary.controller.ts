import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaService } from './prisma/prisma.service';

@Controller('vocabulary')
@UseGuards(JwtAuthGuard)
export class VocabularyController {
  /**
   * GET /vocabulary/all?level=5
   * Returns all vocab for the given level (for session queue)
   */
  @Get('all')
  async getAllVocabulary(@Query('level') level: string) {
    const levelNum = Number(level);
    return this.prisma.vocabulary.findMany({
      where: { level: levelNum },
      orderBy: { id: 'asc' },
    });
  }
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /vocabulary/stats?level=5
   * Returns total and learned vocab counts for the given level, for the current user
   */
  @Get('stats')
  async getVocabStats(@Query('level') level: string, @Req() req: any) {
    const levelNum = Number(level);
    const userId = req.user?.sub;
    const total = await this.prisma.vocabulary.count({ where: { level: levelNum } });
    // Get all vocabulary IDs for this level
    const vocabIds = await this.prisma.vocabulary.findMany({
      where: { level: levelNum },
      select: { id: true },
    });
    const vocabIdList = vocabIds.map(v => v.id);
    // Count learned vocab from UserProgress (itemType: VOCAB, learned: true) for this user and vocab IDs in this level
    const learned = await this.prisma.userProgress.count({
      where: {
        userId,
        itemType: 'VOCAB',
        learned: true,
        itemId: { in: vocabIdList },
      },
    });
    return { total, learned };
  }
  /**
   * GET /vocabulary/next?level=5&mode=normal&exclude=...
   * Returns one vocab for the given level, not in exclude list, random or ordered, and not learned by the user
   */
  @Get('next')
  async getNextVocabulary(
    @Query('level') level: string,
    @Query('mode') mode: 'normal' | 'random' = 'normal',
    @Query('exclude') exclude: string = '',
    @Req() req: any
  ) {
    const levelNum = Number(level);
    const userId = req.user?.sub;


    // Get all vocabulary IDs for this level
    const vocabIds = await this.prisma.vocabulary.findMany({
      where: { level: levelNum },
      select: { id: true },
    });
    const vocabIdList = vocabIds.map(v => v.id);
    // Get all vocab IDs learned by this user for this level
    const learnedVocab = await this.prisma.userProgress.findMany({
      where: {
        userId,
        itemType: 'VOCAB',
        learned: true,
        itemId: { in: vocabIdList },
      },
      select: { itemId: true },
    });
    const learnedIds = learnedVocab.map((p) => p.itemId);

    // Sanitize exclude array: remove empty/invalid values (UUIDs are strings)
    let excludeArray: string[] = [];
    if (typeof exclude === 'string' && exclude.length > 0) {
      excludeArray = exclude.split(',').filter(id => id && id !== 'NaN');
    }
    // Merge excludeArray and learnedIds
    const allExclude = Array.from(new Set([...excludeArray, ...learnedIds]));

    const where: any = { level: levelNum };
    if (allExclude.length > 0) {
      where.id = { notIn: allExclude };
    }

    if (mode === 'random') {
      // Get count of remaining
      const count = await this.prisma.vocabulary.count({ where });
      if (count === 0) return null;
      const skip = Math.floor(Math.random() * count);
      const [vocab] = await this.prisma.vocabulary.findMany({ where, skip, take: 1 });
      return vocab || null;
    } else {
      // Normal mode: return the next in order (lowest id not in exclude)
      const [vocab] = await this.prisma.vocabulary.findMany({
        where,
        orderBy: {
          id: 'asc'
        },
        take: 1
      });
      return vocab || null;
    }
  }
}

