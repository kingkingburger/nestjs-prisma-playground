import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(createLoginDto: CreateLoginDto) {
    const { email, password } = createLoginDto;

    const user = await this.userService.user({ email });

    if (!user || (await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, username: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
      user: user,
    };
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        '잘못된 인증 정보입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
