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
import { StickerBlocksDocs } from './docs/stickerBlocks-docs.decorator';

@StickerBlocksDocs
@ApiTags('게시글 API')
@Controller('articles/:articleId/stickers')
export class StickerBlocksController {
  constructor(private readonly svc_stickerBlocks: StickerBlocksService) {}

  @UseGuards(AuthGuardV2)
  @Post('bulk')
  async createStickerBlocks(
    @Body() body: StickerBlocksCreateRequestDto,
    @Param('articleId') articleId: number,
    // @Req() req: Request,
  ): Promise<StickerBlockDto[]> {
    // const userId = req.user.userId;
    return await this.svc_stickerBlocks.createStickerBlocks({
      ...body,
      articleId,
    });
  }
}
