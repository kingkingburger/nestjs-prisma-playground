import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from 'src/api/post/post.service';
import { Post as PostModel } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiSecurity('Authorization')
  async createDraft(@Body() postData: CreatePostDto): Promise<PostModel> {
    const { title, content, userId } = postData;
    return this.postService.createPost({
      title,
      content,
      User: {
        connect: { id: userId },
      },
    });
  }

  @Get('/id/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Get('/feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      orderBy: { createdAt: 'desc' },
      where: { published: true },
    });
  }

  @Get('/filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Put('/publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Put('/count/up/id/:id')
  async countUpPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
    });
  }

  @Put('/recommendCount/id/:id/userId/:userId/status/:status')
  @UseGuards(AuthGuard)
  @ApiSecurity('Authorization')
  async recommendCountPost(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Param('status') status: string,
  ): Promise<PostModel> {
    return this.postService.updateRecommendPost({
      where: { id: Number(id), userId: Number(userId) },
      status: status,
    });
  }

  @Delete('/id/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
