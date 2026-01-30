import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('kanji')
export class KanjiController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getKanji(
    @Query('jlptLevel') jlptLevel?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string
  ) {
    const where: any = {};
    if (jlptLevel) where.jlptLevel = jlptLevel;
    if (search) where.character = { contains: search };
    const kanji = await this.prisma.kanji.findMany({
      where,
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 100,
      orderBy: { character: 'asc' },
    });
    return kanji;
  }
}
