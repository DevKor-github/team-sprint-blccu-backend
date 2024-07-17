import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'swagger docs로 redirect' })
  @Get('/')
  @HttpCode(301)
  get(@Res() res: Response) {
    return res.redirect('/api-docs');
  }

  @ApiOperation({ summary: 'health check' })
  @Get('/health')
  healthCheck() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
