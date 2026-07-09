import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { DocsService } from './docs.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('docs')
export class DocsController {
  constructor(private docsService: DocsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('generate')
  async generateDocs(@Body('structure') structure: any) {
    const result = await this.docsService.generateDoc(structure);
    return { data: result };
  }
}
