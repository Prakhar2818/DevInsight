import { Controller, Post, Body } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('explain')
  async explainFile(@Body() body: any) {
    const explanation = await this.fileService.explainCode(body.code);

    return {
      explanation,
    };
  }
}
