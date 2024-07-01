import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @ApiProperty({
    example: new Date().toDateString(),
    description: '제목',
  })
  title: string;

  @ApiProperty({
    example: new Date().toDateString(),
    description: '내용',
  })
  content: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'user',
  })
  userId: number;
}
