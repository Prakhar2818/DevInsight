import { Injectable } from '@nestjs/common';
import { LlmService } from '../ai/llm.service';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorPattern } from '../schema/error.schema';

@Injectable()
export class DebugService {
  constructor(
    private llmService: LlmService,

    @InjectModel(ErrorPattern.name)
    private errorModel: Model<ErrorPattern>,
  ) {}

  async analyzeError(error: string) {
    // 1️⃣ Check database
    const existingError = await this.errorModel.findOne({
      error: { $regex: error, $options: 'i' },
    });

    if (existingError) {
      return {
        source: 'database',
        cause: existingError.cause,
        solution: existingError.solution,
      };
    }

    // 2️⃣ AI fallback
    const aiResult = await this.llmService.debugError(error);

    // 3️⃣ Save new error pattern to database
    const newErrorPattern = new this.errorModel({
      error: error,
      cause: 'Analyzed by AI',
      solution: aiResult,
    });
    await newErrorPattern.save();

    return {
      source: 'ai',
      analysis: aiResult,
    };
  }
}
