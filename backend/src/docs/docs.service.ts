import { Injectable } from '@nestjs/common';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from '../ai/llm.service';

@Injectable()
export class DocsService {
  constructor(private readonly llmService: LlmService) {}

  async generateDoc(structure: any) {
    if (!structure) {
      throw new Error(
        'Repository structure is required to generate documentation',
      );
    }

    // Generate the markdown documentation using LLM
    const markdownContent =
      await this.llmService.generateDocumentation(structure);

    // Create a DOCX version
    const doc = new Document({
      sections: [
        {
          children: markdownContent.split('\n').map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line)],
              }),
          ),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Ensure docs directory exists (optional, could write to static folder)
    const fileName = `devinsight-docs-${Date.now()}.docx`;
    const filePath = path.join(process.cwd(), 'public', fileName);

    // Make sure public directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public'));
    }

    fs.writeFileSync(filePath, buffer);

    return {
      markdown: markdownContent,
      downloadUrl: `http://localhost:4000/${fileName}`,
    };
  }
}
