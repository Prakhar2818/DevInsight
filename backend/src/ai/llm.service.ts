import { Injectable } from '@nestjs/common';
import { Ollama } from '@langchain/ollama';

@Injectable()
export class LlmService {
  private model: Ollama;

  constructor() {
    this.model = new Ollama({
      model: 'tinyllama',
      baseUrl: 'http://localhost:11434',
      temperature: 0,
    });
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

    const response = await this.model.invoke(prompt);

    return response;
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

    const response = await this.model.invoke(prompt);

    return response;
  }

  async explainRepoStructure(structure: any) {
    const prompt = `
Explain the architecture of this project structure.

Project Structure:
${JSON.stringify(structure, null, 2)}
`;

    const response = await this.model.invoke(prompt);

    return response;
  }
}
