import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StickersService } from './stickers.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { StickerDto } from './dtos/common/sticker.dto';
import { StickerPatchRequestDto } from './dtos/request/sticker-patch-request.dto';
import { StickersDocs } from './docs/stickers-docs.decorator';

@StickersDocs
@ApiTags('스티커 API')
@Controller()
export class StickersController {
  constructor(private readonly svc_stickers: StickersService) {}

  @UseGuards(AuthGuardV2)
  @Post('stickers/private')
  @UseInterceptors(FileInterceptor('file'))
  async createPrivateSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StickerDto> {
    const userId = req.user.userId;
    return await this.svc_stickers.createPrivateSticker({
      userId,
      file,
    });
  }

  @UseGuards(AuthGuardV2)
  @Get('stickers/private')
  async fetchPrivateStickers(@Req() req: Request): Promise<StickerDto[]> {
    const userId = req.user.userId;
    return await this.svc_stickers.findUserStickers({ userId });
  }

  @Patch('stickers/:stickerId')
  @UseGuards(AuthGuardV2)
  async patchSticker(
    @Req() req: Request,
    @Param('stickerId') stickerId: number,
    @Body() body: StickerPatchRequestDto,
  ): Promise<StickerDto> {
    const userId = req.user.userId;
    return await this.svc_stickers.updateSticker({
      userId,
      stickerId,
      ...body,
    });
  }

  @Get('stickers')
  async fetchPublicStickers(): Promise<StickerDto[]> {
    return await this.svc_stickers.findPublicStickers();
  }

  @UseGuards(AuthGuardV2)
  @Post('users/admin/stickers')
  @UseInterceptors(FileInterceptor('file'))
  async createPublicSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StickerDto> {
    const userId = req.user.userId;
    return await this.svc_stickers.createPublicSticker({
      userId,
      file,
    });
  }

  @UseGuards(AuthGuardV2)
  @Delete('stickers/:stickerId')
  async deleteSticker(
    @Req() req: Request,
    @Param('stickerId') stickerId: number,
  ): Promise<void> {
    const userId = req.user.userId;
    return await this.svc_stickers.deleteSticker({ stickerId, userId });
  }
}
