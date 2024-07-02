import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/api/user/user.module';
import { PostModule } from 'src/api/post/post.module';
import { CommentModule } from './api/comment/comment.module';
import { CategoryModule } from './api/category/category.module';
import { NotificationModule } from './api/notification/notification.module';
import { ActiveLogModule } from './api/active-log/active-log.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PostModule,
    CommentModule,
    CategoryModule,
    NotificationModule,
    ActiveLogModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
