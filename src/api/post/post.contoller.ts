import { Controller } from '@nestjs/common';
import { PostService } from 'src/api/post/post.service';

@Controller('Post')
export class PostController {
  constructor(private readonly PostService: PostService) {}
}
