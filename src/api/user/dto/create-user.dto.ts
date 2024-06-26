import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'abc@gmail.com',
    description: '이메일',
  })
  email: string;
  @ApiProperty({
    example: '1234',
    description: '비밀번호',
  })
  password: string;
  @ApiProperty({
    example: 'min',
    description: '이름',
  })
  name?: string | null;
}
