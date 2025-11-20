import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../../config/database/prisma.service';

@Injectable()
export class PostAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async findPostByUserId(
    findPostDto: Prisma.PostWhereInput,
  ): Promise<Post | null> {
    return this.prismaService.post.findFirstOrThrow({
      where: { userId: findPostDto.userId },
      include: {
        User: {
          select: { name: true },
        },
      },
    });
  }
}
