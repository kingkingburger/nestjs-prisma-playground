import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, HttpException } from '@nestjs/common';
import { UserService } from '../../../src/api/user/user.service';
import { AuthService } from '../../../src/api/auth/auth.service';

const mockBcryptCompare = jest.fn();
jest.mock('bcrypt', () => ({
  compare: (...args: unknown[]) => mockBcryptCompare(...args),
}));

const bcrypt = { compare: mockBcryptCompare };

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserService = {
    user: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUserService.user.mockResolvedValue(null);

      await expect(authService.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw HttpException when password is incorrect', async () => {
      mockUserService.user.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(loginDto)).rejects.toThrow(HttpException);
      await expect(authService.signIn(loginDto)).rejects.toThrow(
        '잘못된 인증 정보입니다.',
      );
    });

    it('should return access token and user when credentials are valid', async () => {
      const mockAccessToken = 'mock.jwt.token';
      mockUserService.user.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockAccessToken);

      const result = await authService.signIn(loginDto);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        user: mockUser,
      });
      expect(mockUserService.user).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          userId: mockUser.id,
          username: mockUser.email,
        },
        {
          expiresIn: '1d',
        },
      );
    });

    it('should call UserService.user with correct email', async () => {
      mockUserService.user.mockResolvedValue(null);

      await expect(authService.signIn(loginDto)).rejects.toThrow();
      expect(mockUserService.user).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(mockUserService.user).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyPassword', () => {
    const plainTextPassword = 'password123';
    const hashedPassword = '$2b$10$hashedPassword';

    it('should not throw when password matches', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        (authService as any).verifyPassword(plainTextPassword, hashedPassword),
      ).resolves.not.toThrow();

      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
    });

    it('should throw HttpException when password does not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        (authService as any).verifyPassword(plainTextPassword, hashedPassword),
      ).rejects.toThrow(HttpException);

      await expect(
        (authService as any).verifyPassword(plainTextPassword, hashedPassword),
      ).rejects.toThrow('잘못된 인증 정보입니다.');
    });

    it('should call bcrypt.compare with correct arguments', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await (authService as any).verifyPassword(
        plainTextPassword,
        hashedPassword,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });
  });
});
