import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor() {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/jwtTest')
  get(@Req() req: Request) {
    console.log(req.user.userId);
    return 'JWT 인증 성공';
  }
}
