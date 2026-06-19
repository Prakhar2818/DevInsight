import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
  };

  const mockUserModel = {
    constructor: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    const user = await service.findByEmail('test@example.com');
    expect(user).toEqual(mockUser);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
