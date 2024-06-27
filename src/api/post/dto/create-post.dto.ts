import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
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
  @ApiProperty({
    example: 1,
    description: 'user',
  })
  userId: number;
}
