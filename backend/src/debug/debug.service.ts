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

  async analyzeError(error: string, userId?: string) {
    // Escape special regex characters in the error string to prevent MongoServerError
    const escapedError = error.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 1️⃣ Check database
    const existingError = await this.errorModel.findOne({
      error: { $regex: escapedError, $options: 'i' },
    });

    if (existingError) {
      if (userId && (!existingError.userIds || !existingError.userIds.includes(userId))) {
        if (!existingError.userIds) existingError.userIds = [];
        existingError.userIds.push(userId);
        existingError.markModified('userIds');
        await existingError.save();
      }
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
      userIds: userId ? [userId] : [],
    });
    await newErrorPattern.save();

    return {
      source: 'ai',
      analysis: aiResult,
    };
  }

  async getHistory(userId?: string) {
    if (userId) {
      const personalHistory = await this.errorModel.find({ userIds: userId }).sort({ _id: -1 }).limit(20);
      if (personalHistory && personalHistory.length > 0) {
        return personalHistory;
      }
    }
    // Fallback to global history if personal history is empty or user is guest
    return this.errorModel.find().sort({ _id: -1 }).limit(10);
  }
}
