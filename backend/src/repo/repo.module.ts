import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { RepoController } from './repo.controller';
import { AiModule } from '../ai/ai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Repo, RepoSchema } from '../schema/repo.schema';
import { ChatSession, ChatSessionSchema } from '../schema/chat.schema';

@Module({
  imports: [
    AiModule,
    MongooseModule.forFeature([
      { name: Repo.name, schema: RepoSchema },
      { name: ChatSession.name, schema: ChatSessionSchema }
    ]),
  ],
  controllers: [RepoController],
  providers: [RepoService],
})
export class RepoModule {}
