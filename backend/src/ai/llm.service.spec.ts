import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from './llm.service';
import { Ollama } from '@langchain/ollama';

// Mock Ollama
jest.mock('@langchain/ollama', () => {
  return {
    Ollama: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockResolvedValue('Mocked AI response'),
      };
    }),
  };
});

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmService],
    }).compile();

    service = module.get<LlmService>(LlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return explainRepoStructure mock', async () => {
    const res = await service.explainRepoStructure({});
    expect(res).toEqual('Mocked AI response');
  });

  it('should return explainCode mock', async () => {
    const res = await service.explainCode('const a = 1;');
    expect(res).toEqual('Mocked AI response');
  });

  it('should return debugError mock', async () => {
    const res = await service.debugError('NullPointerException');
    expect(res).toEqual('Mocked AI response');
  });
});
