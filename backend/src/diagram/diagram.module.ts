import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagramController } from './diagram.controller';
import { DiagramService } from './diagram.service';
import { Repo, RepoSchema } from '../schema/repo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Repo.name, schema: RepoSchema }]),
  ],
  controllers: [DiagramController],
  providers: [DiagramService],
})
export class DiagramModule {}
