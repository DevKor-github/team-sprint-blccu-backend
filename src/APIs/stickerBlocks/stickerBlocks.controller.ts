import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StickerBlocksService } from './stickerBlocks.service';
import { CreateStickerBlockDto } from './dto/create-stickerBlock.dto';

@ApiTags('스티커 블록 API')
@Controller('stickerBlocks')
export class StickerBlocksController {
  constructor(private readonly stickerBlocksService: StickerBlocksService) {}

  @ApiOperation({
    summary: '게시글 속 스티커 생성',
    description:
      '게시글과 스티커 아이디를 매핑한 스티커 블록을 생성한다. 세부 스타일 좌표값을 저장한다.',
  })
  @Post()
  async createStickerBlock(@Body() body: CreateStickerBlockDto) {
    return await this.stickerBlocksService.create(body);
  }
}
