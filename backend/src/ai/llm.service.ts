import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class LlmService {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey: string;
  private readonly fallbackModels = [
    'openrouter/free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-4-31b-it:free',
    'nousresearch/hermes-3-llama-3.1-405b:free',
    'meta-llama/llama-3.2-3b-instruct:free'
  ];

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async generateContent(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new HttpException('OpenRouter API Key not configured.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    for (let i = 0; i < this.fallbackModels.length; i++) {
      const model = this.fallbackModels[i];
      let attempts = 0;
      
      while (attempts < 2) {
        try {
          const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:4000',
              'X-Title': 'DevInsight'
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: prompt }]
            })
          });

          if (response.status === 429) {
            attempts++;
            await this.sleep(1500 * attempts);
            continue;
          }

          if (!response.ok) {
            const errData = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errData}`);
          }

          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
          } else {
            throw new Error('Invalid response structure from OpenRouter');
          }
        } catch (error: any) {
          console.warn(`Model ${model} failed:`, error.message);
          break; // Break while loop to try next model
        }
      }
    }

    throw new HttpException(
      'All free OpenRouter models failed or are rate limited.',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async explainCode(code: string) {
    const prompt = `
You are an expert software engineer.

Explain the following code in simple terms.
Describe:
1. What the code does
2. Main functions/classes
3. Important logic

Code:
${code}
`;
    return this.generateContent(prompt);
  }

  async debugError(error: string) {
    const prompt = `
You are a debugging assistant.

Analyze this error message and suggest fixes.

Error:
${error}

Return:
1. Possible causes
2. Recommended fixes
3. Example solution
`;
    return this.generateContent(prompt);
  }

  async explainRepoStructure(structure: any) {
    const prompt = `
Explain the architecture of this project structure.

Project Structure:
${typeof structure === 'string' ? structure : JSON.stringify(structure, null, 2)}
`;
    return this.generateContent(prompt);
  }
}
