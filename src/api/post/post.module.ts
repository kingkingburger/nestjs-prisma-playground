import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { PostController } from 'src/api/post/post.contoller';
import { PostService } from 'src/api/post/post.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService, UserService],
})
export class PostModule {}
