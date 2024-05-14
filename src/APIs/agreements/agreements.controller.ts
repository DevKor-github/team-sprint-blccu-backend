import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { CreateAgreementsInput } from './dtos/create-agreements.dto';
import { FetchAgreementDto } from './dtos/fetch-agreement.dto';
import { PatchAgreementInput } from './dtos/patch-agreement.dto';
import { FetchContractDto } from './dtos/fetch-contract.dto';

@ApiTags('유저 API')
@Controller('users')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @ApiOperation({ summary: 'contract fetch' })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Get('contracts')
  async fetchContract(@Query() query: FetchContractDto) {
    const data = await this.agreementsService.fetchContract({ ...query });
    return data;
  }

  @ApiOperation({ summary: '온보딩 동의' })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: FetchAgreementDto })
  @UseGuards(AuthGuardV2)
  @Post('me/agreement')
  async agree(
    @Req() req: Request,
    @Body() body: CreateAgreementsInput,
  ): Promise<FetchAgreementDto> {
    const kakaoId = req.user.userId;
    return await this.agreementsService.create({ ...body, kakaoId });
  }

  @ApiOperation({ summary: '로그인된 유저의 온보딩 동의 내용들을 fetch' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [FetchAgreementDto] })
  @UseGuards(AuthGuardV2)
  @Get('me/agreements')
  async fetchAgreements(@Req() req: Request): Promise<FetchAgreementDto[]> {
    const kakaoId = req.user.userId;
    return await this.agreementsService.fetchAll({ kakaoId });
  }

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '[어드민용] 특정 유저의 온보딩 동의 내용을 조회' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [FetchAgreementDto] })
  @UseGuards(AuthGuardV2)
  @Get('admin/:userId/agreements')
  async fetchAgreementAdmin(
    @Req() req: Request,
    @Param('userId') targetUserKakaoId: number,
  ): Promise<FetchAgreementDto[]> {
    const kakaoId = req.user.userId;
    await this.agreementsService.adminCheck({ kakaoId });
    return await this.agreementsService.fetchAll({
      kakaoId: targetUserKakaoId,
    });
  }

  @ApiOperation({ summary: '동의 여부를 수정' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: FetchAgreementDto })
  @UseGuards(AuthGuardV2)
  @Patch('me/agreement/:agreementId')
  async patchAgreement(
    @Req() req: Request,
    @Param('agreementId') id: number,
    @Body() body: PatchAgreementInput,
  ): Promise<FetchAgreementDto> {
    const userKakaoId = req.user.userId;
    return await this.agreementsService.patch({ ...body, id, userKakaoId });
  }
}
