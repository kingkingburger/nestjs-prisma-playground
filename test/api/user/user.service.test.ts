import { PrismaService } from '../../../src/config/database/prisma.service';
import { UserService } from '../../../src/api/user/user.service';
import { User } from '@prisma/client';
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
  });
});
