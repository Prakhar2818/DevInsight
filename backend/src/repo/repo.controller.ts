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
    console.log('Received body:', JSON.stringify(body));
    
    const repoUrl = body?.repoUrl || body?.url;

    if (!repoUrl || typeof repoUrl !== 'string') {
      throw new HttpException(
        'Invalid request: repoUrl is required in body.repoUrl',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Clean the URL if it has extra quotes
    const cleanUrl = repoUrl.replace(/^"+|"+$/g, '');

    try {
      new URL(cleanUrl);
    } catch {
      throw new HttpException(
        'Invalid URL format: ' + cleanUrl,
        HttpStatus.BAD_REQUEST,
      );
    }

    const repoPath = await this.repoService.cloneRepo(cleanUrl);

    // Get flat list of all files for FileTree
    const files = this.repoService.flattenFiles(repoPath);
    
    // Get nested structure for analysis
    const structure = this.repoService.readDirectoryRecursive(repoPath);

    return {
      repoUrl: cleanUrl,
      repoPath,
      files,
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
