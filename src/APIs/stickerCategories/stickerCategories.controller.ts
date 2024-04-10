import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StickerCategoriesService } from './stickerCategories.service';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MapCategoryDto } from './dtos/map-category.dto';
import { StickerCategory } from './entities/stickerCategory.entity';

@ApiTags('스티커 카테고리 API')
@Controller('stickercg')
export class StickerCategoriesController {
  constructor(
    private readonly stickerCategoriesService: StickerCategoriesService,
  ) {}

  @ApiOperation({
    summary: '스티커 카테고리 생성',
    description: '[어드민 전용] 스티커 카테고리를 만든다.',
  })
  @ApiOkResponse({ description: '생성 완료', type: StickerCategory })
  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create/:name')
  async createCategory(@Req() req: Request, @Param('name') name: string) {
    const kakaoId = req.user.userId;
    return await this.stickerCategoriesService.createCategory({
      kakaoId,
      name,
    });
  }

  @ApiOperation({
    summary: '스티커와 카테고리 매핑',
    description: '[어드민 전용] 스티커에 카테고리를 매핑한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('map')
  async mapCategory(
    @Req() req: Request,
    @Body() mapCategoryDto: MapCategoryDto,
  ) {
    const kakaoId = req.user.userId;
    return await this.stickerCategoriesService.mapCategory({
      kakaoId,
      ...mapCategoryDto,
    });
  }
  @ApiOperation({
    summary: '카테고리 fetchAll',
    description: '카테고리를 모두 조회한다.',
  })
  @Get()
  async fetchCategories() {
    return await this.stickerCategoriesService.fetchCategories();
  }

  @ApiOperation({
    summary: '카테고리 이름에 해당하는 스티커를 fetchAll',
    description: '카테고리를 이름으로 찾고, 이에 매핑된 스티커들을 가져온다',
  })
  @Get('fetch/:name')
  async fetchStickersByCategoryName(@Param('name') name: string) {
    return await this.stickerCategoriesService.fetchStickersByCategoryName({
      name,
    });
  }
}
