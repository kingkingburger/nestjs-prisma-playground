import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Post as PostModel } from '@prisma/client';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: '새 게시글 작성' })
  async createPost(@Body() postData: CreatePostDto): Promise<PostModel> {
    const { title, content, userId } = postData;
    return this.postService.createNewPost({
      title,
      content,
      User: {
        connect: { id: userId },
      },
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  async getPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.findPostById({ id: Number(id) });
  }

  @Get('/')
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiQuery({ name: 'search', required: false, description: '검색어' })
  async getPosts(@Query('search') search?: string): Promise<PostModel[]> {
    if (search) {
      return this.postService.findPosts({
        filter: {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
      });
    }

    return this.postService.findPosts({
      sort: { createdAt: 'desc' },
      filter: { published: true },
    });
  }

  @Put('/:id/views')
  @ApiOperation({ summary: '조회수 증가' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  async incrementViews(@Param('id') id: string): Promise<PostModel> {
    return this.postService.incrementViewCount({
      id: Number(id),
    });
  }

  @Put('/:postId/recommendations')
  @UseGuards(AuthGuard)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: '게시글 추천' })
  @ApiParam({ name: 'postId', description: '게시글 ID' })
  async updateRecommendation(
    @Param('postId') postId: string,
    @Query('userId') userId: string,
    @Query('action') action: 'increase' | 'decrease',
  ): Promise<PostModel> {
    return this.postService.updatePostRecommendation({
      postId: { id: Number(postId) },
      userId: Number(userId),
      action,
    });
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePostById({ id: Number(id) });
  }
}
