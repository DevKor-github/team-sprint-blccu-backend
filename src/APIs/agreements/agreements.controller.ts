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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { AgreementCreateRequestDto } from './dtos/request/agreement-create-request.dto';
import { AgreementDto } from './dtos/common/agreement.dto';
import { AgreementPatchRequestDto } from './dtos/request/agreement-patch-request.dto';
import { AgreementsDocs } from './docs/agreements-docs.decorator';

@AgreementsDocs
@ApiTags('유저 API')
@Controller('users')
export class AgreementsController {
  constructor(private readonly svc_agreements: AgreementsService) {}

  @UseGuards(AuthGuardV2)
  @Post('me/agreement')
  async agree(
    @Req() req: Request,
    @Body() body: AgreementCreateRequestDto,
  ): Promise<AgreementDto> {
    const userId = req.user.userId;
    return await this.svc_agreements.createAgreement({ ...body, userId });
  }

  @UseGuards(AuthGuardV2)
  @Get('me/agreements')
  async fetchAgreements(@Req() req: Request): Promise<AgreementDto[]> {
    const userId = req.user.userId;
    return await this.svc_agreements.findAgreements({ userId });
  }

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
