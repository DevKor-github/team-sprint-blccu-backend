import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { CreateAgreementsInput } from './dtos/create-agreements.dto';

@Controller('users')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @ApiOperation({})
  @ApiCookieAuth()
  @ApiCreatedResponse({})
  @UseGuards(AuthGuardV2)
  @Post('me/agreement')
  async agree(@Req() req: Request, @Body() body: CreateAgreementsInput) {
    const kakaoId = req.user.kakaoId;
    await this.agreementsService.create({ ...body, kakaoId });
  }

  @ApiOperation({})
  @ApiCookieAuth()
  @ApiCreatedResponse({})
  @UseGuards(AuthGuardV2)
  @Get('me/agreements')
  async fetchAgreement(@Req() req: Request) {
    const kakaoId = req.user.kakaoId;
  }

  @ApiOperation({})
  @ApiCookieAuth()
  @ApiCreatedResponse({})
  @UseGuards(AuthGuardV2)
  @Get(':userId/agreements')
  async fetchAgreementAdmin(
    @Req() req: Request,
    @Param('userId') targetUserKakaoId: number,
  ) {
    const kakaoId = req.user.kakaoId;
  }

  @ApiOperation({})
  @ApiCookieAuth()
  @ApiCreatedResponse({})
  @UseGuards(AuthGuardV2)
  @Patch('me/agreement/:agreementId')
  async patchAgreement(@Req() req: Request, @Param('agreementId') id: number) {
    const kakaoId = req.user.kakaoId;
  }
}
