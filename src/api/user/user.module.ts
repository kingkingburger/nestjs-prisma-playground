import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/database/prisma.module';
import { UserController } from 'src/api/user/user.controller';
import { UserService } from 'src/api/user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
