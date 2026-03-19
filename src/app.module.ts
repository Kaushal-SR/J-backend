import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HiraganaModule } from './hiragana/hiragana.module';
import { AuthModule } from './auth/auth.module';
import { KatakanaModule } from './katakana/katakana.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { GrammarModule } from './grammar/grammar.module';
import { VocabularyController } from './vocabulary.controller';
import { KanjiController } from './kanji.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,   // 👈 makes env available everywhere
    }),
    PrismaModule,
    AuthModule,
    HiraganaModule,
    KatakanaModule,
    UserProgressModule,
    GrammarModule,
  ],
  controllers: [AppController, VocabularyController, KanjiController],
  providers: [AppService],
})
export class AppModule {}
