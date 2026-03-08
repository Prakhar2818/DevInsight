import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';
import { DebugController } from './debug.controller';
import { AiModule } from '../ai/ai.module';

import { MongooseModule } from '@nestjs/mongoose';
import { ErrorPattern, ErrorPatternSchema } from '../schema/error.schema';

@Module({
  imports: [
    AiModule,
    MongooseModule.forFeature([
      { name: ErrorPattern.name, schema: ErrorPatternSchema },
    ]),
  ],
  controllers: [DebugController],
  providers: [DebugService],
})
export class DebugModule {}
