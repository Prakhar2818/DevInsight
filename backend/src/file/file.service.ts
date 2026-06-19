import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LlmService } from '../ai/llm.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(private llmService: LlmService) {}

  async explainCode(code: string) {
    const result = await this.llmService.explainCode(code);
    return result;
  }

  getDirectoryTree(dirPath: string, rootId: string = 'root') {
    if (!fs.existsSync(dirPath)) {
      throw new HttpException('Repository path not found', HttpStatus.NOT_FOUND);
    }

    const buildTree = (currentPath: string, idPrefix: string) => {
      const stats = fs.statSync(currentPath);
      const name = path.basename(currentPath);
      const id = idPrefix;

      if (stats.isDirectory()) {
        const children = fs.readdirSync(currentPath)
          .filter(file => !file.startsWith('.') && file !== 'node_modules')
          .map(file => buildTree(path.join(currentPath, file), `${idPrefix}/${file}`));
        
        return { id, label: name, children };
      }

      return { id, label: name };
    };

    return buildTree(dirPath, rootId);
  }

  getFileContent(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      throw new HttpException('Path is a directory', HttpStatus.BAD_REQUEST);
    }

    return fs.readFileSync(filePath, 'utf-8');
  }
}
