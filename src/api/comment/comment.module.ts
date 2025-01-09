import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '../../config/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
