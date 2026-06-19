import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { LlmService } from '../ai/llm.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('FileService', () => {
  let service: FileService;
  let mockLlmService = {
    explainCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: LlmService, useValue: mockLlmService },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDirectoryTree', () => {
    it('should generate a tree structure', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockImplementation((p: string) => ({
        isDirectory: () => !p.includes('.ts'),
      }));
      (fs.readdirSync as jest.Mock).mockReturnValue(['file.ts']);

      const tree = service.getDirectoryTree('/mock/repo');
      expect(tree).toBeDefined();
      expect(tree.id).toBe('root');
      expect(tree.children).toHaveLength(1);
      expect(tree.children[0].label).toBe('file.ts');
    });
  });

  describe('getFileContent', () => {
    it('should return file content as string', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
      (fs.readFileSync as jest.Mock).mockReturnValue('const a = 1;');

      const content = service.getFileContent('/mock/repo/file.ts');
      expect(content).toBe('const a = 1;');
    });
  });
});
