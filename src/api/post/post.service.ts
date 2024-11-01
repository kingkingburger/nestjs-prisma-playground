import { Injectable } from '@nestjs/common';
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
    postId: Prisma.PostWhereUniqueInput;
    userId: number;
    action: 'increase' | 'decrease';
  }): Promise<Post> {
    const { postId, userId, action } = params;

    const post = await this.prismaService.post.findFirst({
      where: { id: postId.id },
    });

    if (!userId) {
      throw new Error('사용자 ID가 필요합니다');
    }

    await this.prismaService.postRecommendation.create({
      data: {
        userId,
        postId: postId.id,
      },
    });

    return this.prismaService.post.update({
      where: postId,
      data: {
        recommendCount:
          action === 'increase'
            ? post.recommendCount + 1
            : post.recommendCount - 1,
      },
    });
  }

  async deletePostById(postId: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prismaService.post.delete({
      where: postId,
    });
  }
}
