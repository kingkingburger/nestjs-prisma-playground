import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(createLoginDto: CreateLoginDto) {
    const { email, password } = createLoginDto;

    const user = await this.userService.user({ email });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, username: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: user,
    };
  }
}
