import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { RepoModule } from './repo/repo.module';
import { ParserModule } from './parser/parser.module';
import { DebugModule } from './debug/debug.module';
import { FileModule } from './file/file.module';
import { DocsModule } from './docs/docs.module';
import { DiagramModule } from '../src/diagram/diagram.module';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AiModule,
    RepoModule,
    ParserModule,
    DebugModule,
    FileModule,
    DocsModule,
    DiagramModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
