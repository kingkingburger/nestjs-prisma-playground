import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostService } from '../../../src/api/post/service/post.service';
import { PrismaService } from '../../../src/config/database/prisma.service';
import { Post } from '@prisma/client';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    post: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
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
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPostById', () => {
    it('should return a post with user information', async () => {
      const expectedPost = {
        ...mockPost,
        User: { name: 'Test User' },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(expectedPost);

      const result = await service.findPostById({ id: 1 });

      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          User: {
            select: { name: true },
          },
        },
      });
    });

    it('should return null if post is not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      const result = await service.findPostById({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('findPosts', () => {
    it('should return paginated posts with total count', async () => {
      const mockPosts = [
        { ...mockPost, id: 1, User: { name: 'User 1' } },
        { ...mockPost, id: 2, User: { name: 'User 2' } },
      ];

      mockPrismaService.post.count.mockResolvedValue(10);
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.findPosts({
        pagination: { skip: 0, take: 2 },
        sort: { createdAt: 'desc' },
      });

      expect(result).toEqual({
        data: mockPosts,
        total: 10,
      });
      expect(mockPrismaService.post.count).toHaveBeenCalled();
      expect(mockPrismaService.post.findMany).toHaveBeenCalled();
    });

    it('should apply filters correctly', async () => {
      const filter = { published: true };
      mockPrismaService.post.count.mockResolvedValue(5);
      mockPrismaService.post.findMany.mockResolvedValue([]);

      await service.findPosts({ filter });

      expect(mockPrismaService.post.count).toHaveBeenCalledWith({
        where: filter,
      });
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: filter,
        }),
      );
    });

    it('should handle empty results', async () => {
      mockPrismaService.post.count.mockResolvedValue(0);
      mockPrismaService.post.findMany.mockResolvedValue([]);

      const result = await service.findPosts({});

      expect(result).toEqual({
        data: [],
        total: 0,
      });
    });
  });

  describe('createNewPost', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'New Post',
        content: 'New Content',
        User: { connect: { id: 1 } },
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.createPost(postData);

      expect(result).toEqual(mockPost);
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: postData,
      });
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count by 1', async () => {
      const postWithViews = { ...mockPost, viewCount: 5 };
      const updatedPost = { ...mockPost, viewCount: 6 };

      mockPrismaService.post.findFirst.mockResolvedValue(postWithViews);
      mockPrismaService.post.update.mockResolvedValue(updatedPost);

      const result = await service.incrementViewCount({ id: 1 });

      expect(result.viewCount).toBe(6);
      expect(mockPrismaService.post.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          viewCount: 6,
        },
      });
    });
  });

  describe('updatePost', () => {
    it('should update comment content', async () => {
      const updateDto = { content: 'Updated content' };
      const updatedComment = {
        id: 1,
        content: 'Updated content',
        userId: 1,
        postId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.comment.update.mockResolvedValue(updatedComment);

      const result = await service.updatePost(1, updateDto);

      expect(result).toEqual(updatedComment);
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith({
        data: { content: updateDto.content },
        where: { id: 1 },
      });
    });
  });

  describe('updatePostRecommendation', () => {
    it('should increase recommendation count', async () => {
      const postWithRecommends = { ...mockPost, recommendCount: 5 };
      const updatedPost = { ...mockPost, recommendCount: 6 };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          post: {
            findUnique: jest.fn().mockResolvedValue(postWithRecommends),
            update: jest.fn().mockResolvedValue(updatedPost),
          },
        });
      });

      const result = await service.updatePostRecommendation({
        postId: 1,
        userId: 1,
        action: 'increase',
      });

      expect(result.recommendCount).toBe(6);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should decrease recommendation count', async () => {
      const postWithRecommends = { ...mockPost, recommendCount: 5 };
      const updatedPost = { ...mockPost, recommendCount: 4 };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          post: {
            findUnique: jest.fn().mockResolvedValue(postWithRecommends),
            update: jest.fn().mockResolvedValue(updatedPost),
          },
        });
      });

      const result = await service.updatePostRecommendation({
        postId: 1,
        userId: 1,
        action: 'decrease',
      });

      expect(result.recommendCount).toBe(4);
    });

    it('should throw BadRequestException if userId is missing', async () => {
      await expect(
        service.updatePostRecommendation({
          postId: 1,
          userId: null,
          action: 'increase',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          post: {
            findUnique: jest.fn().mockResolvedValue(null),
            update: jest.fn(),
          },
        });
      });

      await expect(
        service.updatePostRecommendation({
          postId: 999,
          userId: 1,
          action: 'increase',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePostById', () => {
    it('should delete a post and return it', async () => {
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.deletePostById({ id: 1 });

      expect(result).toEqual(mockPost);
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error if post does not exist', async () => {
      mockPrismaService.post.delete.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.deletePostById({ id: 999 })).rejects.toThrow(
        'Record not found',
      );
    });
  });
});
