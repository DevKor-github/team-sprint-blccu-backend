import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StickerBlocksService } from './stickerBlocks.service';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { StickerBlockDto } from './dtos/common/stickerBlock.dto';
import { StickerBlocksCreateRequestDto } from './dtos/request/stickerBlocks-create-request.dto';

@ApiTags('게시글 API')
@Controller('articles/:articleId/stickers')
export class StickerBlocksController {
  constructor(private readonly stickerBlocksService: StickerBlocksService) {}

  @ApiOperation({
    summary: '게시글 속 스티커 생성',
    description:
      '게시글과 스티커 아이디를 매핑한 스티커 블록을 생성한다. 세부 스타일 좌표값을 저장한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @ApiCreatedResponse({ type: [StickerBlockDto] })
  @Post('bulk')
  async createStickerBlocks(
    @Body() body: StickerBlocksCreateRequestDto,
    @Param('articleId') articleId: number,
    // @Req() req: Request,
  ): Promise<StickerBlockDto[]> {
    // const userId = req.user.userId;
    return await this.stickerBlocksService.createStickerBlocks({
      ...body,
      articleId,
    });
  }
}
