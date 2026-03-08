import { Injectable } from '@nestjs/common';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as fs from 'fs';

@Injectable()
export class DocsService {
  async generateDoc(text: string) {
    if (!text) {
      throw new Error('Text content is required to generate documentation');
    }
    
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun(text),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    fs.writeFileSync('devinsight-docs.docx', buffer);

    return 'Documentation generated';
  }
}
