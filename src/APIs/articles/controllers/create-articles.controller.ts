import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('게시글 API')
@Controller('articles')
export class createArticlesController {
  constructor(private readonly createArticlesService: createArticlesService) {}
}
