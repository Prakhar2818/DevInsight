import { Controller, Post, Body } from '@nestjs/common';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private docsService: DocsService) {}

  @Post('generate')
  generate(@Body() body: any) {
    const text = body?.content || body?.text || body?.repoUrl;
    return this.docsService.generateDoc(text);
  }
}
