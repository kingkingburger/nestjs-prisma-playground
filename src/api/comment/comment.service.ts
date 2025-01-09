import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../config/database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  createComment(createCommentDto: CreateCommentDto) {
    const { content, userId, postId } = createCommentDto;
    const insertData: Prisma.CommentCreateInput = {
      content,
      User: { connect: { id: userId } },
      Post: { connect: { id: postId } },
    };

    return this.prisma.comment.create({ data: insertData });
  }

  findOneByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId: postId },
      include: { Post: false, User: { select: { name: true } } },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      data: { content: updateCommentDto.content },
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({
      where: { id: id },
    });
  }
}
