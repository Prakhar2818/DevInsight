import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RepoService } from './repo.service';

@Controller('repo')
export class RepoController {
  constructor(private repoService: RepoService) {}

  @Post('analyze')
  async analyze(@Body() body: any) {
    const repoUrl = body?.url;

    if (!repoUrl || typeof repoUrl !== 'string') {
      throw new HttpException(
        'Invalid request: URL is required in body.url',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      new URL(repoUrl);
    } catch {
      throw new HttpException(
        'Invalid URL format: ' + repoUrl,
        HttpStatus.BAD_REQUEST,
      );
    }

    const repoPath = await this.repoService.cloneRepo(repoUrl);

    const structure = this.repoService.readDirectory(repoPath);

    return {
      repoUrl,
      repoPath,
      structure,
    };
  }

  @Post('ask')
  async askQuestion(@Body() body: any) {
    const { structure, question } = body;

    if (!structure || !question) {
      throw new HttpException(
        'structure and question are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const answer = await this.repoService.askQuestion(structure, question);

    return {
      answer,
    };
  }

  @Post('intelligence')
  async analyzeRepoIntelligence(@Body() body: any) {
    const { repoUrl, structure } = body;

    if (!repoUrl || !structure) {
      throw new HttpException(
        'repoUrl and structure are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.repoService.repoIntelligence(repoUrl, structure);

    return {
      result,
    };
  }
}
