import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { UserModule } from 'src/api/user/user.module';
import { PostModule } from 'src/api/post/post.module';

@Module({
  imports: [PrismaModule, UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
