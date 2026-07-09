import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagramController } from './diagram.controller';
import { DiagramService } from './diagram.service';
import { Repo, RepoSchema } from '../schema/repo.schema';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Repo.name, schema: RepoSchema }]),
    AiModule,
  ],
  controllers: [DiagramController],
  providers: [DiagramService],
})
export class DiagramModule {}
