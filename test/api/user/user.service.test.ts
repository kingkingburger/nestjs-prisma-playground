import { PrismaService } from '../../../src/config/database/prisma.service';
import { UserService } from '../../../src/api/user/user.service';
import { Prisma, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'dnjsalsgh123@gmail.com',
    password: '1234',
    name: 'minho',
    profilePicture: null,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a user ', async () => {
      const expectedUser = {
        ...mockUser,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.user({ id: 1 });
      expect(result).toEqual(expectedUser);
    });

    test('유저가 없다면 null 반환', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.user({ id: 999999 });

      expect(result).toBeNull();
    });

    test('should return paginated users with total count', async () => {
      const mockUsers = [
        { ...mockUser, id: 1 },
        { ...mockUser, id: 2 },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.users({
        skip: 0,
        take: 2,
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('createNewUser', () => {
    test('should create a new user', async () => {
      const userData: Prisma.UserCreateInput = {
        email: 'minho@gmail.com',
        password: '1234',
        name: 'minho',
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.createUser(userData);
      expect(result).toEqual(mockUser);
    });
  });
});
