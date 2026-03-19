import { Controller, Get, Query } from '@nestjs/common';
import { GrammarService } from './grammar.service';

@Controller('grammar')
export class GrammarController {
  constructor(private readonly grammarService: GrammarService) {}

  @Get()
  async getByLevel(@Query('level') level?: string) {
    const jlptLevel = level || 'N5';
    const items = await this.grammarService.findByLevel(jlptLevel);
    return items.map((g) => ({
      id: g.id,
      grammarPoint: g.grammarPoint,
      reading: g.reading,
      jlptLevel: g.jlptLevel as any,
      structure: g.structure,
      meaning: g.meaning,
      nuance: g.nuance,
      formality: g.formality,
      category: g.category,
      similarGrammar: g.similarGrammar,
      attachesTo: g.attachesTo,
      examples: (g.examples as any) ?? null,
      familiarity: g.familiarity,
      status: g.status,
      lastReviewed: g.lastReviewed?.toISOString() ?? null,
      personalNotes: g.personalNotes,
    }));
  }
}
