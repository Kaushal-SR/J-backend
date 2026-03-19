import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GrammarService {
  constructor(private readonly prisma: PrismaService) {}

  async findByLevel(level: string) {
    return this.prisma.grammar.findMany({
      where: {
        jlptLevel: {
          contains: level,
        },
      },
      orderBy: {
        grammarPoint: 'asc',
      },
    });
  }
}
