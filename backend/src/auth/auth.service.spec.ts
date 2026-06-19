import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should throw ConflictException if user exists on register', async () => {
    usersService.findByEmail.mockResolvedValue({ id: '1' } as any);

    await expect(authService.register({ email: 'test@example.com' })).rejects.toThrow(ConflictException);
  });

  it('should throw UnauthorizedException on invalid login', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(authService.login({ email: 'wrong', password: '123' })).rejects.toThrow(UnauthorizedException);
  });
});
