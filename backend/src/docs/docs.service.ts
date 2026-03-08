import { Injectable } from '@nestjs/common';
import { Document, Packer, Paragraph } from 'docx';
import * as fs from 'fs';

@Injectable()
export class DocsService {
  async generateDoc(text: string) {
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph(text)],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    fs.writeFileSync('devinsight-docs.docx', buffer);

    return 'Documentation generated';
  }
}
