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
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ImageUploadDto } from 'src/commons/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Sticker } from './entities/sticker.entity';

@ApiTags('stickers')
@Controller('stickers')
export class StickersController {
  constructor(private readonly stickersService: StickersService) {}

  @ApiProperty({ description: '[유저용] 개인 스티커를 업로드한다.' })
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

  @ApiProperty({ description: '[어드민용] 공용 스티커를 업로드한다.' })
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
