import { Test, TestingModule } from '@nestjs/testing';
import { ParserService } from './parser.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParserService],
    }).compile();

    service = module.get<ParserService>(ParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect NestJS and PostgreSQL from package.json', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readdirSync as jest.Mock).mockImplementation((dir: string) => {
      if (dir === '/mock/path') return ['package.json'];
      return [];
    });
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('package.json')) {
        return JSON.stringify({
          dependencies: {
            '@nestjs/core': '^8.0.0',
            'pg': '^8.7.1',
            'typeorm': '^0.2.38',
            'typescript': '^4.4.4',
          },
        });
      }
      return '';
    });

    const result = service.analyzeRepository('/mock/path');

    expect(result.framework).toEqual('NestJS');
    expect(result.database).toEqual('PostgreSQL');
    expect(result.orm).toEqual('TypeORM');
    expect(result.language).toEqual('TypeScript');
  });

  it('should detect React and MongoDB', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readdirSync as jest.Mock).mockImplementation((dir: string) => {
      if (dir === '/mock/path') return ['package.json'];
      return [];
    });
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('package.json')) {
        return JSON.stringify({
          dependencies: {
            'react': '^17.0.2',
            'mongoose': '^6.0.12',
          },
        });
      }
      return '';
    });

    const result = service.analyzeRepository('/mock/path');

    expect(result.framework).toEqual('React');
    expect(result.database).toEqual('MongoDB');
    expect(result.orm).toEqual('Mongoose');
    expect(result.language).toEqual('JavaScript');
  });
});
