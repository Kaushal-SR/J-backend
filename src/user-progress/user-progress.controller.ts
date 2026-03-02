// ...existing code...
import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-progress')
@UseGuards(JwtAuthGuard)
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Post('learned')
  async markLearned(
    @Body()
    body: {
      itemId: string;
      itemType: 'HIRAGANA' | 'KATAKANA' | 'KANJI' | 'VOCAB';
    },
    @Req() req: any,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new Error('User ID not found in request.');
    return this.userProgressService.markLearned(userId, body.itemId, body.itemType);
  }

  @Post('not-learned')
  async markNotLearned(
    @Body()
    body: {
      itemId: string;
      itemType: 'HIRAGANA' | 'KATAKANA' | 'KANJI' | 'VOCAB';
    },
    @Req() req: any,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new Error('User ID not found in request.');
    return this.userProgressService.markNotLearned(userId, body.itemId, body.itemType);
  }

  @Post('bookmark')
  async bookmark(
    @Body()
    body: {
      itemId: string;
      itemType: 'HIRAGANA' | 'KATAKANA' | 'KANJI' | 'VOCAB';
      value: boolean;
    },
    @Req() req: any,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new Error('User ID not found in request.');
    return this.userProgressService.setBookmark(userId, body.itemId, body.itemType, body.value);
  }

  @Get('learned')
  async getLearned(@Req() req: any) {
    return this.userProgressService.getLearned(req.user?.sub);
  }
}
