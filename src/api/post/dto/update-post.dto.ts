import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdatePostDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'user',
  })
  userId: number;

  @IsString()
  @Optional()
  @ApiProperty({
    example: new Date().toDateString(),
    description: '제목',
  })
  title: string;

  @Optional()
  @ApiProperty({
    example: new Date().toDateString(),
    description: '내용',
  })
  content: string;
}
