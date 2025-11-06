import { PrismaService } from '../../../src/config/database/prisma.service';
import { Post, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../../../src/api/comment/comment.service';

describe('CommentService', () => {
  let service: CommentService;
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

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    published: true,
    userId: 1,
    categoryId: null,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01'),
    viewCount: 0,
    recommendCount: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });
});
