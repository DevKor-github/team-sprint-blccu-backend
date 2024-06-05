import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StickerBlocksService } from './stickerBlocks.service';
import { CreateStickerBlockInput } from './dtos/create-stickerBlock.dto';
import { CreateStickerBlocksInput } from './dtos/create-stickerBlocks.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';

@ApiTags('게시글 API')
@Controller('posts/:postId/stickers')
export class StickerBlocksController {
  constructor(private readonly stickerBlocksService: StickerBlocksService) {}

  @ApiOperation({
    summary: '게시글 속 스티커 생성',
    description:
      '게시글과 스티커 아이디를 매핑한 스티커 블록을 생성한다. 세부 스타일 좌표값을 저장한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Post(':stickerId')
  async createStickerBlock(
    @Body() body: CreateStickerBlockInput,
    @Param('postId') postsId: number,
    @Param('stickerId') stickerId: number,
    @Req() req: Request,
  ) {
    const kakaoId = req.user.userId;
    return await this.stickerBlocksService.create({
      ...body,
      kakaoId,
      postsId,
      stickerId,
    });
  }

  @ApiOperation({
    summary: '게시글 속 스티커 생성',
    description:
      '게시글과 스티커 아이디를 매핑한 스티커 블록을 생성한다. 세부 스타일 좌표값을 저장한다.',
  })
  @Post('bulk')
  async createStickerBlocks(
    @Body() body: CreateStickerBlocksInput,
    @Param('postId') postsId: number,
    @Req() req: Request,
  ) {
    const kakaoId = req.user.userId;
    return await this.stickerBlocksService.bulkInsert({
      ...body,
      postsId,
      kakaoId,
    });
  }
}
