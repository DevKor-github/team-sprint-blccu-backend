import {
  Controller,
  HttpCode,
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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ImageUploadDto } from 'src/commons/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Sticker } from './entities/sticker.entity';

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
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
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
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
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
}
