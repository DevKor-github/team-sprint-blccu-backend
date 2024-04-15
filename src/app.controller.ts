import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'swagger docs로 redirect' })
  @Get('/')
  @HttpCode(301)
  get(@Res() res: Response) {
    return res.redirect('/api-docs');
  }
}
