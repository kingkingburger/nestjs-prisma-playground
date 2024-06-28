import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    example: new Date().toISOString(),
    description: '내용',
  })
  content: string;
}
