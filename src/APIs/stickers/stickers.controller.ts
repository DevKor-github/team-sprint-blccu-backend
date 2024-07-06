import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StickersService } from './stickers.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { ImageUploadRequestDto } from 'src/modules/images/dtos/image-upload-request.dto';
import { StickerDto } from './dtos/common/sticker.dto';
import { StickerPatchRequestDto } from './dtos/request/sticker-patch-request.dto';

@ApiTags('스티커 API')
@Controller()
export class StickersController {
  constructor(private readonly stickersService: StickersService) {}

  @ApiOperation({
    summary: '[유저용] 개인 스티커를 업로드한다.',
    description: '개인만 조회 가능한 유저용 스티커를 업로드한다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadRequestDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: StickerDto,
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Post('stickers/private')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createPrivateSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StickerDto> {
    const userId = req.user.userId;
    return await this.stickersService.createPrivateSticker({
      userId,
      file,
    });
  }

  @ApiOperation({
    summary: '재사용 가능한 private 스티커를 fetch한다.',
    description:
      '본인이 만든 재사용 가능한 스티커들을 fetch한다. toggle이 우선적으로 이루어져야함.',
  })
  @ApiOkResponse({ description: '조회 성공', type: [StickerDto] })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @HttpCode(200)
  @Get('stickers/private')
  async fetchPrivateStickers(@Req() req: Request): Promise<StickerDto[]> {
    const userId = req.user.userId;
    return await this.stickersService.findUserStickers({ userId });
  }

  @ApiOperation({
    summary: '스티커의 image_url 혹은 재사용 여부를 설정한다.',
    description:
      '본인이 만든 스티커를 patch한다. image_url 변경 시 기존의 이미지는 s3에서 제거된다.',
  })
  @Patch('stickers/:id')
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @ApiOkResponse({ type: StickerDto })
  @HttpCode(200)
  async patchSticker(
    @Req() req: Request,
    @Param('stickerId') stickerId: number,
    @Body() body: StickerPatchRequestDto,
  ): Promise<StickerDto> {
    const userId = req.user.userId;
    return await this.stickersService.updateSticker({
      userId,
      stickerId,
      ...body,
    });
  }

  @ApiOperation({
    summary: 'public 스티커를 fetch한다.',
    description: '블꾸가 만든 스티커들을 fetch한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: [StickerDto] })
  @Get('stickers')
  @HttpCode(200)
  async fetchPublicStickers(): Promise<StickerDto[]> {
    return await this.stickersService.findPublicStickers();
  }

  @ApiTags('어드민 API')
  @ApiOperation({
    summary: '[어드민용] 공용 스티커를 업로드한다.',
    description:
      '블꾸에서 제작한 스티커를 업로드한다. 어드민 권한이 있는 유저 전용. 카테고리와 매핑을 해주어야 조회 가능.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadRequestDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: StickerDto,
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Post('users/admin/stickers')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createPublicSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StickerDto> {
    const userId = req.user.userId;
    return await this.stickersService.createPublicSticker({
      userId,
      file,
    });
  }

  @ApiOperation({ summary: '스티커 삭제', description: '스티커를 삭제한다.' })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @ApiNoContentResponse({ description: '삭제 성공' })
  @Delete('stickers/:stickerId')
  async deleteSticker(
    @Req() req: Request,
    @Param('stickerId') stickerId: number,
  ): Promise<void> {
    const userId = req.user.userId;
    return await this.stickersService.deleteSticker({ stickerId, userId });
  }
}
