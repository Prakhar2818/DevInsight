import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from 'src/ai/llm.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Repo } from '../schema/repo.schema';

@Injectable()
export class RepoService {
  constructor(
    private llmService: LlmService,
    @InjectModel(Repo.name)
    private repoModel: Model<Repo>,
  ) {}

  private git = simpleGit();

  async cloneRepo(repoUrl: string) {
    const repoName = repoUrl.split('/').pop()?.replace('.git', '');
    const repoPath = `repos/${repoName}`;

    if (!fs.existsSync('repos')) {
      fs.mkdirSync('repos', { recursive: true });
    }

    if (fs.existsSync(repoPath)) {
      return repoPath;
    }

    try {
      await this.git.clone(repoUrl, repoPath);
    } catch (error) {
      throw new HttpException(
        `Failed to clone repository: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return repoPath;
  }

  // Read single directory (top-level only)
  readDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    return files.map((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      return {
        name: file,
        type: stat.isDirectory() ? 'folder' : 'file',
      };
    });
  }

  // Recursively read all files and folders
  readDirectoryRecursive(dir: string, relativePath: string = ''): any[] {
    const items: any[] = [];
    const files = fs.readdirSync(dir);

    // Filter out node_modules, .git, and other hidden folders
    const filteredFiles = files.filter(file => !file.startsWith('.') && file !== 'node_modules');

    for (const file of filteredFiles) {
      const fullPath = path.join(dir, file);
      const fileRelativePath = relativePath ? `${relativePath}/${file}` : file;
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // For directories, recursively get contents
        const children = this.readDirectoryRecursive(fullPath, fileRelativePath);
        items.push({
          name: file,
          type: 'folder',
          path: fileRelativePath,
          children: children.length > 0 ? children : []
        });
      } else {
        items.push({
          name: file,
          type: 'file',
          path: fileRelativePath,
        });
      }
    }

    return items;
  }

  // Flatten the directory tree for FileTree component
  flattenFiles(dir: string, relativePath: string = ''): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    // Filter out node_modules, .git, and other hidden folders
    const filteredItems = items.filter(item => !item.startsWith('.') && item !== 'node_modules');

    for (const item of filteredItems) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.flattenFiles(fullPath, itemRelativePath));
      } else {
        files.push(itemRelativePath);
      }
    }

    return files;
  }

  async askQuestion(structure: any, question: string) {
    const prompt = `
You are a senior software engineer.

Answer the question about this repository.

Repository Structure:
${JSON.stringify(structure)}

Question:
${question}
`;

    const answer = await this.llmService.explainRepoStructure(prompt);

    return answer;
  }

  async repoIntelligence(repoUrl: string, structure: any) {
    // 1️⃣ Check database cache
    const existingRepo = await this.getRepo(repoUrl);

    if (existingRepo) {
      return {
        source: 'database',
        analysis: existingRepo.analysis,
      };
    }

    // 2️⃣ Generate AI analysis
    const prompt = `
You are a software architect.

Analyze this repository structure and identify:

1. Framework
2. Possible database
3. Architecture pattern
4. Important modules

Repository Structure:
${JSON.stringify(structure, null, 2)}
`;

// test 

    const response = await this.llmService.explainRepoStructure(prompt);

    // 3️⃣ Save result to database
    await this.saveRepo({
      repoUrl,
      structure,
      analysis: response,
    });

    return {
      source: 'ai',
      analysis: response,
    };
  }

  async saveRepo(data: any) {
    const repoData = {
      ...data,
      structure: JSON.stringify(data.structure),
    };
    const repo = new this.repoModel(repoData);

    return repo.save();
  }

  async getRepo(repoUrl: string) {
    return this.repoModel.findOne({ repoUrl });
  }
}
