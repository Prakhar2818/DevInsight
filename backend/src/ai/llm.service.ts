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
    'nousresearch/hermes-3-llama-3.1-405b:free',
    'mistralai/mistral-7b-instruct:free',
    'openchat/openchat-7b:free',
    'gryphe/mythomax-l2-13b:free',
  ];

  constructor() {
    this.apiKey =
      process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async generateContent(
    prompt: string,
    expectJson: boolean = false,
  ): Promise<string> {
    if (!this.apiKey) {
      throw new HttpException(
        'OpenRouter API Key not configured.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    for (let i = 0; i < this.fallbackModels.length; i++) {
      const model = this.fallbackModels[i];
      let attempts = 0;

      while (attempts < 2) {
        try {
          const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:4000',
              'X-Title': 'DevInsight',
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: prompt }],
            }),
          });

          if (response.status === 429) {
            attempts++;
            await this.sleep(1500 * attempts);
            continue;
          }

          if (!response.ok) {
            const errData = await response.text();
            throw new Error(
              `OpenRouter API Error: ${response.status} - ${errData}`,
            );
          }

          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;

            if (expectJson) {
              // Try to parse it to ensure it's valid JSON before accepting it
              let jsonStr = content
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
              const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                jsonStr = jsonMatch[0];
              }
              // If it fails to parse, it will throw and trigger the catch block to try next model
              JSON.parse(jsonStr);
              // Return the clean JSON string
              return jsonStr;
            }

            return content;
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
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  /**
   * Token Optimization: Converts bulky JSON tree structure into a minimal text tree.
   * This drastically reduces LLM token consumption and improves generation speed.
   */
  public minifyStructure(structure: any): string {
    let parsed = structure;
    if (typeof structure === 'string') {
      try {
        parsed = JSON.parse(structure);
      } catch (e) {
        // If it's not JSON (e.g. natural language analysis), return as is
        return structure;
      }
    }

    if (!parsed) return '';

    let output = '';
    const buildTree = (nodes: any[], indent: string = '') => {
      if (!Array.isArray(nodes)) return;
      for (const node of nodes) {
        if (node.type === 'folder' || node.children) {
          output += `${indent}${node.name}/\n`;
          buildTree(node.children || [], indent + '  ');
        } else {
          output += `${indent}${node.name}\n`;
        }
      }
    };

    if (Array.isArray(parsed)) {
      buildTree(parsed);
    } else if (parsed.name || parsed.children) {
      buildTree([parsed]);
    } else {
      // Unrecognized JSON, just fallback to stringify with zero spaces
      return JSON.stringify(parsed);
    }

    return output.trim();
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
${this.minifyStructure(structure)}
`;
    return this.generateContent(prompt);
  }

  async traceFlow(query: string, context: string) {
    // Dynamically find and minify any bulky JSON structure blocks embedded in the context
    let optimizedContext = context;
    try {
      const jsonMatch = context.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const minified = this.minifyStructure(jsonStr);
        optimizedContext = context.replace(jsonStr, minified);
      }
    } catch (e) {
      // Ignore if parsing fails
    }

    const prompt = `
You are an expert software architect analyzing a codebase.
Trace the execution flow of the following query across the given codebase context.

Query: ${query}

Codebase Context:
${optimizedContext}

Generate a valid JSON object with 'nodes' and 'edges' compatible with React Flow.
Output ONLY the raw JSON object. Do not wrap in markdown blocks, do not add introductory text. Just the JSON.

CRITICAL INSTRUCTIONS:
- You must NOT output any text, reasoning, or XML before or after the JSON.
- DO NOT attempt to call any tools or read files. Use ONLY the provided context.
- Your entire response MUST be exactly a valid JSON object.

Format:
{
  "nodes": [
    { "id": "1", "data": { "label": "LoginController" }, "position": { "x": 0, "y": 0 } },
    { "id": "2", "data": { "label": "AuthService" }, "position": { "x": 0, "y": 100 } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "label": "calls login()" }
  ]
}
`;
    const response = await this.generateContent(prompt, true);

    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse tracer JSON:', response);
      throw new Error('LLM did not return valid JSON for flow trace.');
    }
  }

  async generateArchitectureDiagram(
    structure: any,
    type: string = 'architecture',
  ) {
    let typeInstructions = '';

    switch (type) {
      case 'class':
        typeInstructions = `Generate a Class Diagram representation. Map out key modules/folders as classes. The label should contain the class name and key methods/properties using newlines (\\n).`;
        break;
      case 'sequence':
        typeInstructions = `Generate a Sequence Diagram representation. Map out a typical execution flow (e.g., Client -> Controller -> Service -> DB). Use nodes for steps/participants and edges for the messages between them.`;
        break;
      case 'component':
        typeInstructions = `Generate a Component Diagram representation. Map out the high-level components.`;
        break;
      case 'activity':
        typeInstructions = `Generate an Activity Diagram representation. Map out the standard activity flow of the app.`;
        break;
      case 'architecture':
      default:
        typeInstructions = `Generate a System Architecture Diagram representation. Map out the system architecture.`;
        break;
    }

    const prompt = `
You are an expert software architect.
${typeInstructions}

Generate a valid JSON object with 'nodes' and 'edges' compatible with React Flow.
Output ONLY the raw JSON object. Do not wrap in markdown blocks, do not add introductory text. Just the JSON.

CRITICAL INSTRUCTIONS:
- You must NOT output any text, reasoning, or XML before or after the JSON.
- Ensure nodes are spaced out logically by setting realistic "position" { x, y } coordinates (e.g. spaced by 200px).
- Your entire response MUST be exactly a valid JSON object.

Format:
{
  "nodes": [
    { "id": "1", "data": { "label": "API Gateway" }, "position": { "x": 0, "y": 0 } },
    { "id": "2", "data": { "label": "Auth Service" }, "position": { "x": 250, "y": 100 } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "label": "routes traffic" }
  ]
}

Project Structure:
${this.minifyStructure(structure)}
`;
    const response = await this.generateContent(prompt, true);

    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse diagram JSON:', response);
      throw new Error('LLM did not return valid JSON for diagram.');
    }
  }

  async generateDocumentation(structure: any) {
    const prompt = `
You are a senior technical writer and software architect.
Generate comprehensive, professional documentation for the provided repository structure.
Include the following sections:
- **Project Overview**: What the project does based on the folder structure and likely stack.
- **Architecture**: A breakdown of the components (e.g., frontend, backend, modules).
- **Setup & Installation**: Standard instructions to install and run the code.

Format the output strictly in clean Markdown.

Project Structure:
${this.minifyStructure(structure)}
`;
    return this.generateContent(prompt);
  }
}
