import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostService } from 'src/api/post/post.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { UserModule } from 'src/api/user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PostService],
})
export class AppModule {}
