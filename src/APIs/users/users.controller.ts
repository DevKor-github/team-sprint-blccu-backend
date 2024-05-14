import {
  Body,
  Controller,
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
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from './dtos/user-response.dto';
import { PatchUserInput } from './dtos/patch-user.input';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { ImageUploadDto } from 'src/common/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 배포 때 삭제!!!!
  @Get('all')
  @ApiOperation({
    summary: '[ONLY FOR DEV] 모든 유저의 정보를 조회한다',
    description: '배포 때 삭제할 거임. 개발 및 테스트용',
  })
  findAllUsers() {
    return this.usersService.getAll();
  }
  // ================================

  @ApiOperation({
    summary: '이름이 포함된 유저 검색',
    description: '이름에 username이 포함된 유저를 검색한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: [UserResponseDto] })
  @HttpCode(200)
  @Get('username/:username')
  async findUsersByName(
    @Param('username') username: string,
  ): Promise<UserResponseDto[]> {
    return await this.usersService.findUsersByName({ username });
  }

  @ApiOperation({
    summary: '특정 유저 프로필 조회(id)',
    description: 'id가 일치하는 유저 프로필을 조회한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: UserResponseDto })
  @HttpCode(200)
  @Get('profile/id/:userId')
  async findUserByKakaoId(
    @Param('userId') kakaoId: number,
  ): Promise<UserResponseDto> {
    return await this.usersService.findUserByKakaoId({ kakaoId });
  }

  @ApiOperation({
    summary: '특정 유저 프로필 조회(handle)',
    description: 'handle이 일치하는 유저 프로필을 조회한다.',
  })
  @ApiOkResponse({ description: '조회 성공', type: UserResponseDto })
  @HttpCode(200)
  @Get('profile/handle/:handle')
  async findUserByHandle(
    @Param('handle') handle: string,
  ): Promise<UserResponseDto> {
    return await this.usersService.findUserByHandle({ handle });
  }

  @ApiOperation({
    summary: '로그인된 유저의 프로필 불러오기',
    description: '로그인된 유저의 프로필을 불러온다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ description: '불러오기 완료', type: UserResponseDto })
  @Get('me')
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  async fetchUser(@Req() req: Request): Promise<UserResponseDto> {
    const kakaoId = req.user.userId;
    return await this.usersService.findUserByKakaoId({ kakaoId });
  }

  @ApiOperation({
    summary: '로그인된 유저의 이름이나 설명, 핸들을 변경',
    description: '로그인된 유저의 이름이나 설명, 핸들, 혹은 모두를 변경한다.',
  })
  @ApiOkResponse({ description: '변경 성공', type: UserResponseDto })
  @ApiCookieAuth()
  @Patch('me')
  @HttpCode(200)
  @UseGuards(AuthGuardV2)
  async patchUser(
    @Req() req: Request,
    @Body() body: PatchUserInput,
  ): Promise<UserResponseDto> {
    const kakaoId = req.user.userId;
    const { description, username, handle } = body;
    return await this.usersService.patchUser({
      kakaoId,
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
    type: ImageUploadDto,
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
  async uploadProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const userKakaoId = req.user.userId;
    return await this.usersService.uploadProfileImage({
      userKakaoId,
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
    type: ImageUploadDto,
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
    const userKakaoId = req.user.userId;
    return await this.usersService.uploadBackgroundImage({
      userKakaoId,
      file,
    });
  }
}
