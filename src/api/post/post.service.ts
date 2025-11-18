import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { UpdateCommentDto } from '../comment/dto/update-comment.dto';

import { PaginatedResult } from '../../config/type/paging/type';
import { PrismaService } from '../../config/database/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async findPostById(
    postId: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prismaService.post.findUnique({
      where: postId,
      include: {
        User: {
          select: { name: true },
        },
      },
    });
  }

  async findPosts(params: {
    pagination?: {
      skip?: number;
      take?: number;
    };
    cursor?: Prisma.PostWhereUniqueInput;
    filter?: Prisma.PostWhereInput;
    sort?: Prisma.PostOrderByWithRelationInput;
  }): Promise<PaginatedResult<Post>> {
    const { pagination, cursor, filter, sort } = params;

    const [total, posts] = await Promise.all([
      // Get total count
      this.prismaService.post.count({
        where: filter,
      }),
      // Get paginated data
      this.prismaService.post.findMany({
        skip: pagination?.skip || undefined,
        take: pagination?.take || undefined,
        cursor,
        where: filter,
        orderBy: sort,
        include: {
          User: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      data: posts,
      total,
    };
  }

  async createPost(postData: Prisma.PostCreateInput): Promise<Post> {
    return this.prismaService.post.create({
      data: postData,
    });
  }

  async incrementViewCount(postId: Prisma.PostWhereUniqueInput): Promise<Post> {
    const post = await this.prismaService.post.findFirst({
      where: { id: postId.id },
    });

    return this.prismaService.post.update({
      where: postId,
      data: {
        viewCount: post.viewCount + 1,
      },
    });
  }

  async updatePost(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prismaService.comment.update({
      data: { content: updateCommentDto.content },
      where: { id: id },
    });
  }

  async updatePostRecommendation(params: {
    postId: number;
    userId: number;
    action: 'increase' | 'decrease';
  }): Promise<Post> {
    const { postId, userId, action } = params;

    if (!userId) {
      throw new BadRequestException('사용자 ID가 필요합니다');
    }

    return this.prismaService.$transaction(async (prisma) => {
      // 게시물 존재 여부 확인
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException('게시물을 찾을 수 없습니다');
      }

      // 게시물 추천 수 업데이트 및 반환
      return prisma.post.update({
        where: { id: postId },
        data: {
          recommendCount:
            action === 'increase'
              ? post.recommendCount + 1
              : post.recommendCount - 1,
        },
      });
    });
  }

  async deletePostById(postId: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prismaService.post.delete({
      where: postId,
    });
  }
}
