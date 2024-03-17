import { Body, Controller, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@ApiTags('좋아요 API')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({
    summary: '좋아요 토글하기',
    description: '[Posts 테이블에 pessimistic_lock 적용] 좋아요를 토글한다.',
  })
  @Post()
  async toggleLike(@Body() body: ToggleLikeDto) {
    return this.likesService.toggleLike(body);
  }
}
