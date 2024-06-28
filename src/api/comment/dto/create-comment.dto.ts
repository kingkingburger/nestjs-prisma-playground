import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: new Date().toISOString(),
    description: '내용',
  })
  content: string;
  @ApiProperty({
    example: 1,
    description: 'user pk',
  })
  userId: number;
  @ApiProperty({
    example: 1,
    description: 'post pk',
  })
  postId: number;
}
