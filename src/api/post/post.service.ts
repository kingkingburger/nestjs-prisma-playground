import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UpdateCommentDto } from '../comment/dto/update-comment.dto';

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

  async updatePost(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prismaService.comment.update({
      data: { content: updateCommentDto.content },
      where: { id: id },
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
