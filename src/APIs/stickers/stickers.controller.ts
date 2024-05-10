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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ImageUploadDto } from 'src/common/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Sticker } from './entities/sticker.entity';
import { RemoveBgDto } from './dtos/remove-bg.dto';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { FindStickerInput } from './dtos/find-sticker.dto';
import { UpdateStickerInput } from './dtos/update-sticker.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';

@ApiTags('스티커 API')
@Controller('stickers')
export class StickersController {
  constructor(private readonly stickersService: StickersService) {}

  @ApiOperation({
    summary: '[유저용] 개인 스티커를 업로드한다.',
    description: '개인만 조회 가능한 유저용 스티커를 업로드한다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: Sticker,
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Post('private')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createPrivateSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Sticker> {
    const userKakaoId = req.user.userId;
    return await this.stickersService.createPrivateSticker({
      userKakaoId,
      file,
    });
  }

  @ApiOperation({
    summary: '[어드민용] 공용 스티커를 업로드한다.',
    description:
      '블꾸에서 제작한 스티커를 업로드한다. 어드민 권한이 있는 유저 전용. 카테고리와 매핑을 해주어야 조회 가능.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: Sticker,
  })
  @ApiUnauthorizedResponse({ description: '어드민이 아님' })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Post('public')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createPublicSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Sticker> {
    const userKakaoId = req.user.userId;
    return await this.stickersService.createPublicSticker({
      userKakaoId,
      file,
    });
  }

  @Get('private')
  @ApiOperation({
    summary: '재사용 가능한 private 스티커를 fetch한다.',
    description:
      '본인이 만든 재사용 가능한 스티커들을 fetch한다. toggle이 우선적으로 이루어져야함.',
  })
  @ApiOkResponse({ description: '조회 성공', type: [Sticker] })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @HttpCode(200)
  async fetchPrivateStickers(@Req() req: Request): Promise<Sticker[]> {
    const userKakaoId = req.user.userId;
    return await this.stickersService.fetchUserStickers({ userKakaoId });
  }

  @ApiOperation({
    summary: '스티커 재사용 여부를 토글한다.',
    description:
      '본인이 만든 스티커의 재사용 여부를 토글한다. 보관함 저장 혹은 삭제 용도로 사용할 것',
  })
  @Post('toggle/:id')
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @HttpCode(200)
  async toggleReusable(@Req() req: Request, @Param('id') id: number) {
    const userKakaoId = req.user.userId;
    return await this.stickersService.toggleReusable({ userKakaoId, id });
  }

  @ApiOperation({
    summary: 'public 스티커를 fetch한다.',
    description: '블꾸가 만든 스티커들을 fetch한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: [Sticker] })
  @Get('public')
  @HttpCode(200)
  async fetchPublicStickers(): Promise<Sticker[]> {
    return await this.stickersService.fetchPublicStickers();
  }

  @ApiOperation({
    summary: '스티커 배경을 제거한다.',
    description: `스티커 배경을 제거하고, url을 받는다. 스티커에 적용하려면 update 필요.\n 
     workflow: post('background') => delete('s3') => patch('image') 
      `,
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Post('background')
  async removeBg(@Body() body: RemoveBgDto): Promise<ImageUploadResponseDto> {
    return await this.stickersService.removeBg({ url: body.url });
  }

  @Patch('image')
  @ApiOperation({
    summary: '스티커 객체 이미지 수정',
    description:
      '스티커 객체의 이미지 url을 변경한다. 호출 이전에 기존의 이미지 제거를 권장.',
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  async updateSticker(
    @Req() req: Request,
    @Body() body: UpdateStickerInput,
  ): Promise<Sticker> {
    const kakaoId = req.user.userId;
    return await this.stickersService.updateSticker({
      kakaoId,
      ...body,
    });
  }

  @ApiOperation({
    summary: 's3에 업로드된 이미지 삭제',
    description: `s3에 올라간 파일을 삭제한다. 스티커 객체가 삭제되지는 않는다.<br>
      sticker 객채에 새로운 이미지를 업데이트 해줄 때, 기존의 이미지를 제거할 때만 사용.<br>
      로직 순서: delete('s3') => patch('image')<br>
      **만약 사용중인 객체의 이미지만 제거 할 경우 이미지가 깨진다.**`,
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Delete('s3')
  @HttpCode(200)
  async removeS3(@Body() body: FindStickerInput, @Req() req: Request) {
    const kakaoId = req.user.userId;
    return await this.stickersService.removeFromS3({
      id: body.id,
      kakaoId,
    });
  }
}
