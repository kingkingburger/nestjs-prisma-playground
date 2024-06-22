import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { PostController } from 'src/api/post/post.contoller';
import { PostService } from 'src/api/post/post.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
