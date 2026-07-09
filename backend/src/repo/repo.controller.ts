import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RepoService } from './repo.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('repo')
export class RepoController {
  constructor(
    private repoService: RepoService,
    private usersService: UsersService,
  ) {}

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
    const files = this.repoService.flattenFiles(repoPath);
    const structure = this.repoService.readDirectoryRecursive(repoPath);

    return {
      repoUrl: cleanUrl,
      repoPath,
      files,
      structure,
    };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('history')
  async getUserHistory(@Request() req: any) {
    const userId =
      req.user && !req.user.isGuest
        ? req.user.userId || req.user._id || req.user.email || null
        : null;
    console.log(
      'getUserHistory called. req.user:',
      req.user,
      'userId:',
      userId,
    );
    const repos = await this.repoService.getUserRepos(userId);
    console.log('getUserRepos returned:', repos.length, 'repos');
    return repos;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('ask')
  async askQuestion(@Request() req: any, @Body() body: any) {
    const { structure, question, repoUrl, selectedFile } = body;

    if (!structure || !question) {
      throw new HttpException(
        'structure and question are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = req.user
      ? req.user.userId || req.user._id || req.user.email
      : null;
    const answer = await this.repoService.askQuestion(
      structure,
      question,
      repoUrl,
      selectedFile,
      userId,
    );

    return { answer };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('chat/:repoUrlEncoded')
  async getChatHistoryUrl(
    @Request() req: any,
    @Param('repoUrlEncoded') repoUrlEncoded: string,
    @Query('filePath') filePath?: string,
  ) {
    if (!req.user) return { history: [] };
    const userId = req.user.userId || req.user._id || req.user.email;
    const repoUrl = decodeURIComponent(repoUrlEncoded);
    const history = await this.repoService.getChatHistory(
      userId,
      repoUrl,
      filePath,
    );
    return { history };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('intelligence')
  async analyzeRepoIntelligence(@Request() req: any, @Body() body: any) {
    const { repoUrl, structure } = body;

    if (!repoUrl || !structure) {
      throw new HttpException(
        'repoUrl and structure are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = req.user
      ? req.user.userId || req.user._id || req.user.email
      : null;
    const result = await this.repoService.repoIntelligence(
      repoUrl,
      structure,
      userId,
    );

    return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('github/list')
  async listGithubRepos(@Request() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user || !user.githubToken) {
      throw new HttpException('No GitHub account connected', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          Authorization: `Bearer ${user.githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const repos = await response.json();
      return repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        url: repo.clone_url,
        description: repo.description,
        updatedAt: repo.updated_at,
      }));
    } catch (error) {
      throw new HttpException(`Failed to fetch GitHub repos: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
