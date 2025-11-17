import { PrismaService } from '../../../src/config/database/prisma.service';
import { Comment, Post, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../../../src/api/comment/comment.service';
import { CreateCommentDto } from '../../../src/api/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '../../../src/api/comment/dto/update-comment.dto';

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
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
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

  const mockComment: Comment = {
    id: 1,
    content: 'Test Comment',
    userId: 1,
    postId: 1,
    parentId: null,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01'),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    test('should create a new Comment', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test Comment',
        userId: 1,
        postId: 1,
      };

      mockPrismaService.comment.create.mockResolvedValue(mockComment);

      const result = await service.createComment(createCommentDto);

      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Test Comment',
          User: { connect: { id: 1 } },
          Post: { connect: { id: 1 } },
        },
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe('findComments', () => {
    it('should return comments by postId ', async () => {
      const mockComments = [{ ...mockComment, User: mockUser, Post: mockPost }];

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await service.findOneByPostId(mockPost.id);

      expect(result).toEqual(mockComments);
    });
  });

  describe('updateComment', () => {
    it('should return comments by postId ', async () => {
      const expectComment = {
        ...mockComment,
        content: 'Updated Comment',
        User: mockUser,
        Post: mockPost,
      };

      mockPrismaService.comment.update.mockResolvedValue(expectComment);

      const updatedComment: UpdateCommentDto = {
        content: 'Updated Comment',
      };

      const result = await service.update(mockComment.id, updatedComment);

      expect(result).toEqual(expectComment);
    });
  });
  describe('deleteComment', () => {
    test('should delete comment', async () => {
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      const result = await service.remove({ id: 1 });
      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
