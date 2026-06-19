import { Controller, Post, Body, Get, Query } from '@nestjs/common';
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

  @Get('tree')
  getTree(@Query('repoPath') repoPath: string) {
    const tree = this.fileService.getDirectoryTree(repoPath);
    return { tree };
  }

  @Get('content')
  getContent(@Query('filePath') filePath: string) {
    const content = this.fileService.getFileContent(filePath);
    return { content };
  }
}
