import { Injectable } from '@nestjs/common';
import { LlmService } from '../ai/llm.service';

@Injectable()
export class FileService {
  constructor(private llmService: LlmService) {}

  async explainCode(code: string) {
    const result = await this.llmService.explainCode(code);

    return result;
  }
}
