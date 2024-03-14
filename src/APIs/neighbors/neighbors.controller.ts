import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NeighborsService } from './neighbors.service';

@Controller('neighbor')
export class NeighborsController {
  constructor(private readonly neighborsService: NeighborsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('follow/:follow_id')
  followUser(@Param('follow_id') follow_id: string, @Req() req: Request) {
    const kakaoId = req.user.userId;
    // 팔로워 팔로우 증가 트랜잭션 만들기
    return this.neighborsService.followUser({ kakaoId, follow_id });
  }
}
