import { Controller, Post, Body } from '@nestjs/common';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private parserService: ParserService) {}

  @Post('analyze')
  analyze(@Body() body: { repoPath: string }) {
    const metadata = this.parserService.analyzeRepository(body.repoPath);

    return {
      metadata,
    };
  }
}
