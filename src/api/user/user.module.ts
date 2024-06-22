import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserController } from 'src/api/user/user.controller';
import { UserService } from 'src/api/user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}
