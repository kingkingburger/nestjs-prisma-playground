import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/config/database/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { PostAuthService } from '../../../src/api/post/service/post.auth.service';

describe('PostAuthService', () => {
  let service: PostAuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findFirstOrThrow: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    comment: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    published: true,
    userId: 1,
    categoryId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    viewCount: 0,
    recommendCount: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostAuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostAuthService>(PostAuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find by userid', async () => {
    const expectedPost = {
      ...mockPost,
      User: { name: 'Test User' },
    };

    mockPrismaService.post.findFirst.mockResolvedValue(expectedPost);

    const findPostDto: Prisma.PostWhereInput = {
      userId: mockPost.id,
    };

    const result = await service.findPostByUserId(findPostDto);

    expect(result).toEqual(expectedPost);
    expect(mockPrismaService.post.findFirst).toHaveBeenCalledWith({
      where: { userId: findPostDto.userId },
      include: {
        User: {
          select: { name: true },
        },
      },
    });
  });

  it('should return null if post is not found', async () => {
    mockPrismaService.post.findFirst.mockResolvedValue(null);

    const findPostDto: Prisma.PostWhereInput = {
      userId: 9999,
    };

    const result = await service.findPostByUserId(findPostDto);

    expect(result).toBeNull();
  });
});
