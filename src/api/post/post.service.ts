import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

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
        PostRecommendation: {
          select: { userId: true, postId: true },
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
  }): Promise<Post[]> {
    const { pagination, cursor, filter, sort } = params;

    return this.prismaService.post.findMany({
      skip: pagination?.skip,
      take: pagination?.take,
      cursor,
      where: filter,
      orderBy: sort,
      include: {
        User: {
          select: { name: true },
        },
      },
    });
  }

  async checkUserRecommendationAtPost(params: {
    userId: number;
    postId: number;
  }): Promise<boolean> {
    const { userId, postId } = params;

    // 추천 기록이 있는지 확인
    const recommendation =
      await this.prismaService.postRecommendation.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });

    // 추천 기록이 있으면 true, 없으면 false 반환
    return recommendation !== null;
  }

  async createNewPost(postData: Prisma.PostCreateInput): Promise<Post> {
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

      // 추천 여부 확인
      const existingRecommendation = await prisma.postRecommendation.findUnique(
        {
          where: {
            unique_user_post_combination: {
              userId,
              postId,
            },
          },
        },
      );

      // 이미 추천했는데 또 추천하거나, 추천하지 않았는데 취소하는 경우 방지
      if (
        (action === 'increase' && existingRecommendation) ||
        (action === 'decrease' && !existingRecommendation)
      ) {
        throw new BadRequestException(
          action === 'increase'
            ? '이미 추천한 게시물입니다'
            : '추천하지 않은 게시물입니다',
        );
      }

      // 추천 상태 업데이트
      if (action === 'decrease') {
        await prisma.postRecommendation.delete({
          where: {
            unique_user_post_combination: {
              userId,
              postId,
            },
          },
        });
      } else {
        await prisma.postRecommendation.create({
          data: {
            userId,
            postId,
          },
        });
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
