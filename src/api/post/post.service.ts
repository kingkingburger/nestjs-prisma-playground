import { Injectable } from '@nestjs/common';

import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
      include: { User: { select: { name: true } } },
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { User: { select: { name: true } } },
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data?: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where } = params;
    const post = await this.prisma.post.findFirst({ where: { id: where.id } });

    return this.prisma.post.update({
      where,
      data: {
        viewCount: post.viewCount + 1,
      },
    });
  }

  async updateRecommendPost(params: {
    where: Prisma.PostWhereUniqueInput;
    data?: Prisma.PostUpdateInput;
    status: string;
  }): Promise<Post> {
    const { where } = params;
    const post = await this.prisma.post.findFirst({ where: { id: where.id } });

    if (!where.userId) {
      throw Error('userId가 존재하지 않습니다');
    }

    await this.prisma.postRecommendation.create({
      data: {
        userId: +where.userId,
        postId: where.id,
      },
    });

    return this.prisma.post.update({
      where,
      data: {
        recommendCount:
          params.status === 'up'
            ? post.recommendCount + 1
            : post.recommendCount - 1,
      },
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
