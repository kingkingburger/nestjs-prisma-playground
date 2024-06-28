import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../config/prisma/prisma.service';
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

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
