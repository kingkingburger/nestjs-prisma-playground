import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/database/prisma.module';

import { PostController } from './post.contoller';

import { UserService } from '../user/user.service';
import { PostService } from './service/post.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService, UserService],
})
export class PostModule {}
