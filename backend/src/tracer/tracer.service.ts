import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { LlmService } from '../ai/llm.service';
import { TraceCache } from '../schema/trace.schema';

@Injectable()
export class TracerService {
  constructor(
    @InjectModel(TraceCache.name) private traceCacheModel: Model<TraceCache>,
    private readonly llmService: LlmService,
  ) {}

  async trace(query: string, context: string) {
    // 1️⃣ Generate a unique hash for this query + context combination
    const hashInput = `${query}::${context}`;
    const queryHash = crypto
      .createHash('sha256')
      .update(hashInput)
      .digest('hex');

    // 2️⃣ Check if this trace already exists in the cache
    const existingCache = await this.traceCacheModel.findOne({ queryHash });
    if (existingCache) {
      return existingCache.result;
    }

    // 3️⃣ If not cached, call LLM to generate trace
    const result = await this.llmService.traceFlow(query, context);

    // 4️⃣ Store the result in cache for future use
    await this.traceCacheModel.create({
      queryHash,
      result,
    });

    return result;
  }
}
