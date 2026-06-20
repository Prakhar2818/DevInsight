import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from '../ai/llm.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Repo } from '../schema/repo.schema';
import { ChatSession } from '../schema/chat.schema';

@Injectable()
export class RepoService {
  constructor(
    private llmService: LlmService,
    @InjectModel(Repo.name) private repoModel: Model<Repo>,
    @InjectModel(ChatSession.name) private chatModel: Model<ChatSession>,
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
  flattenFiles(dir: string, relativePath: string = ''): any[] {
    const files: any[] = [];
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
        files.push({
          name: item,
          path: itemRelativePath,
          type: 'file'
        });
      }
    }

    return files;
  }

  async getChatHistory(userId: string, repoUrl: string, filePath?: string) {
    const query: any = { userId, repoUrl };
    if (filePath) {
      query.filePath = filePath;
    } else {
      query.$or = [{ filePath: null }, { filePath: { $exists: false } }, { filePath: "" }];
    }
    const session = await this.chatModel.findOne(query);
    return session ? session.messages : [];
  }

  async getUserRepos(userId: string | null) {
    const query = userId ? { $or: [{ userId }, { userId: null }] } : { userId: null };
    const repos = await this.repoModel.find(query as any).select('repoUrl framework architecture analysis -_id');
    return repos;
  }

  async askQuestion(structure: any, question: string, repoUrl?: string, selectedFile?: string, userId?: string) {
    let fileContext = '';

    if (repoUrl && selectedFile) {
      try {
        const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'repo';
        const fullPath = path.join(process.cwd(), 'repos', repoName, selectedFile);
        
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          fileContext = `\nContext File (${selectedFile}):\n\`\`\`\n${content.substring(0, 2000)}\n\`\`\`\n`;
        }
      } catch (e) {
        console.error("Failed to read context file", e);
      }
    }

    // Get Chat History
    let chatSession: any = null;
    let chatHistoryContext = '';
    if (userId && repoUrl) {
      const query: any = { userId, repoUrl };
      if (selectedFile) {
        query.filePath = selectedFile;
      } else {
        query.$or = [{ filePath: null }, { filePath: { $exists: false } }, { filePath: "" }];
      }
      
      chatSession = await this.chatModel.findOne(query);
      if (!chatSession) {
        chatSession = new this.chatModel({ 
          userId, 
          repoUrl, 
          filePath: selectedFile || null,
          messages: [] 
        });
      }
      chatSession.messages.push({ role: 'user', content: question });
      
      if (chatSession.messages.length > 1) {
        const historyText = chatSession.messages.slice(-6, -1).map(m => `${m.role}: ${m.content}`).join('\n');
        chatHistoryContext = `\nRecent Chat History:\n${historyText}\n`;
      }
    }

    const prompt = `
You are a senior software engineer.

Answer the question about this repository.
${fileContext ? fileContext : `\nRepository Structure:\n${JSON.stringify(structure).substring(0, 2000)}\n`}
${chatHistoryContext}

Question:
${question}
`;

    const answer = await this.llmService.explainRepoStructure(prompt);

    if (chatSession) {
      chatSession.messages.push({ role: 'ai', content: answer });
      await chatSession.save();
    }

    return answer;
  }

  async getRepo(repoUrl: string, userId?: string) {
    const query: any = { repoUrl };
    if (userId) query.userId = userId;
    return this.repoModel.findOne(query as any).exec();
  }

  async repoIntelligence(repoUrl: string, structure: any, userId?: string) {
    const existingRepo = await this.getRepo(repoUrl, userId);

    if (existingRepo && existingRepo.analysis) {
      return {
        source: 'database',
        analysis: existingRepo.analysis,
      };
    }

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

    const analysis = await this.llmService.explainRepoStructure(prompt);

    const query: any = { repoUrl };
    if (userId) query.userId = userId;

    await this.repoModel.findOneAndUpdate(
      query,
      {
        $set: {
          repoUrl,
          userId,
          structure: JSON.stringify(structure),
          analysis,
        }
      },
      { new: true, upsert: true }
    );

    return {
      source: 'ai',
      analysis,
    };
  }
}
