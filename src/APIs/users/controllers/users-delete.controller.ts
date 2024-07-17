import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersDeleteService } from '../services/users-delete.service';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request, Response } from 'express';
import { UserDeleteRequestDto } from '../dtos/request/user-delete-request.dto';

@ApiTags('유저 API')
@Controller('users')
export class UsersDeleteController {
  constructor(private readonly svc_usersDelete: UsersDeleteService) {}

  @ApiOperation({
    summary: '회원 탈퇴(soft delete)',
    description: '회원을 탈퇴하고 연동된 게시글과 댓글을 soft delete한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @ApiNoContentResponse()
  @HttpCode(204)
  @Delete('me')
  async deleteUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UserDeleteRequestDto,
  ) {
    const userId = req.user.userId;
    const clientDomain = process.env.CLIENT_DOMAIN;
    await this.svc_usersDelete.deleteUser({ userId, ...body });
    res.clearCookie('accessToken', {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      domain: clientDomain,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('isLoggedIn', { httpOnly: false, domain: clientDomain });
    return res.send();
  }
}
