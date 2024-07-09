import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersUpdateService } from '../services/users-update.service';
import { UserDto } from '../dtos/common/user.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { UserPatchRequestDto } from '../dtos/request/user-patch-request.dto';
import { Request } from 'express';
import { ImageUploadRequestDto } from 'src/modules/images/dtos/image-upload-request.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('유저 API')
@Controller('users')
export class UsersUpdateController {
  constructor(private readonly svc_usersUpdate: UsersUpdateService) {}

  @ApiOperation({
    summary: '로그인된 유저의 이름이나 설명, 핸들을 변경',
    description: '로그인된 유저의 이름이나 설명, 핸들, 혹은 모두를 변경한다.',
  })
  @ApiOkResponse({ description: '변경 성공', type: UserDto })
  @ApiCookieAuth()
  @Patch('me')
  @HttpCode(200)
  @UseGuards(AuthGuardV2)
  async patchUser(
    @Req() req: Request,
    @Body() body: UserPatchRequestDto,
  ): Promise<UserDto> {
    const userId = req.user.userId;
    const { description, username, handle } = body;
    return await this.svc_usersUpdate.updateUser({
      userId,
      description,
      username,
      handle,
    });
  }

  @ApiOperation({
    summary: '로그인된 유저의 프로필 이미지를 변경',
    description: '스토리지에 프로필 사진을 업로드하고 변경한다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadRequestDto,
  })
  @ApiCreatedResponse({
    description: '업로드 성공',
    type: ImageUploadResponseDto,
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  @Post('me/profile-image')
  async postProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const userId = req.user.userId;
    return await this.svc_usersUpdate.updateProfileImage({
      userId,
      file,
    });
  }

  @ApiOperation({
    summary: '로그인된 유저의 배경 이미지를 변경',
    description: '스토리지에 배경 사진을 업로드하고 변경한다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadRequestDto,
  })
  @ApiCreatedResponse({
    description: '업로드 성공',
    type: ImageUploadResponseDto,
  })
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  @Post('me/background-image')
  async uploadBackgroundImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const userId = req.user.userId;
    return await this.svc_usersUpdate.updateBackgroundImage({
      userId,
      file,
    });
  }
}
