import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersUpdateService } from '../services/users-update.service';
import { UserDto } from '../dtos/common/user.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { UserPatchRequestDto } from '../dtos/request/user-patch-request.dto';
import { Request } from 'express';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersUpdateDocs } from '../docs/users-update-docs.decorator';

@UsersUpdateDocs
@ApiTags('유저 API')
@Controller('users')
export class UsersUpdateController {
  constructor(private readonly svc_usersUpdate: UsersUpdateService) {}

  @Patch('me')
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

  @UseGuards(AuthGuardV2)
  @UseInterceptors(FileInterceptor('file'))
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

  @UseGuards(AuthGuardV2)
  @UseInterceptors(FileInterceptor('file'))
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
