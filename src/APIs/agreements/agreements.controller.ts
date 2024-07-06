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
import { AgreementGetContractRequestDto } from './dtos/request/agreement-get-contract-request.dto';
import { AgreementCreateRequestDto } from './dtos/request/agreement-create-request.dto';
import { AgreementDto } from './dtos/common/agreement.dto';
import { AgreementPatchRequestDto } from './dtos/request/agreement-patch-request.dto';

@ApiTags('유저 API')
@Controller('users')
export class AgreementsController {
  constructor(private readonly svc_agreements: AgreementsService) {}

  @ApiOperation({ summary: 'contract fetch' })
  @Get('contracts')
  async getContract(@Query() query: AgreementGetContractRequestDto) {
    const data = await this.svc_agreements.findContract({ ...query });
    return data;
  }

  @ApiOperation({ summary: '온보딩 동의' })
  @ApiCookieAuth()
  @ApiCreatedResponse({ type: AgreementDto })
  @UseGuards(AuthGuardV2)
  @Post('me/agreement')
  async agree(
    @Req() req: Request,
    @Body() body: AgreementCreateRequestDto,
  ): Promise<AgreementDto> {
    const userId = req.user.userId;
    return await this.svc_agreements.createAgreement({ ...body, userId });
  }

  @ApiOperation({ summary: '로그인된 유저의 온보딩 동의 내용들을 fetch' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [AgreementDto] })
  @UseGuards(AuthGuardV2)
  @Get('me/agreements')
  async fetchAgreements(@Req() req: Request): Promise<AgreementDto[]> {
    const userId = req.user.userId;
    return await this.svc_agreements.findAgreements({ userId });
  }

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '[어드민용] 특정 유저의 온보딩 동의 내용을 조회' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [AgreementDto] })
  @UseGuards(AuthGuardV2)
  @Get('admin/:userId/agreements')
  async fetchAgreementAdmin(
    @Req() req: Request,
    @Param('userId') targetUserKakaoId: number,
  ): Promise<AgreementDto[]> {
    const userId = req.user.userId;
    await this.svc_agreements.adminCheck({ userId });
    return await this.svc_agreements.findAgreements({
      userId: targetUserKakaoId,
    });
  }

  @ApiOperation({ summary: '동의 여부를 수정' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: AgreementDto })
  @UseGuards(AuthGuardV2)
  @Patch('me/agreement/:agreementId')
  async patchAgreement(
    @Req() req: Request,
    @Param('agreementId') agreementId: number,
    @Body() body: AgreementPatchRequestDto,
  ): Promise<AgreementDto> {
    const userId = req.user.userId;
    return await this.svc_agreements.patchAgreement({
      ...body,
      agreementId,
      userId,
    });
  }
}
