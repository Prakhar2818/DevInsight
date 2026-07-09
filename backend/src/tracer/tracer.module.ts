import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracerController } from './tracer.controller';
import { TracerService } from './tracer.service';
import { AiModule } from '../ai/ai.module';
import { TraceCache, TraceCacheSchema } from '../schema/trace.schema';

@Module({
  imports: [
    AiModule,
    MongooseModule.forFeature([
      { name: TraceCache.name, schema: TraceCacheSchema },
    ]),
  ],
  controllers: [TracerController],
  providers: [TracerService],
})
export class TracerModule {}
