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
import { Request } from 'express';
import { BulkMapCategoryDto } from './dtos/map-category.dto';
import { StickerCategory } from './entities/stickerCategory.entity';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { CreateStickerCategoryInput } from './dtos/create-sticker-category.dto';

@ApiTags('스티커 API')
@Controller()
export class StickerCategoriesController {
  constructor(
    private readonly stickerCategoriesService: StickerCategoriesService,
  ) {}

  @ApiOperation({
    summary: '카테고리 fetchAll',
    description: '카테고리를 모두 조회한다.',
  })
  @Get('stickers/categories')
  async fetchCategories() {
    return await this.stickerCategoriesService.fetchCategories();
  }

  @ApiOperation({
    summary: '카테고리 id에 해당하는 스티커를 fetchAll',
    description: '카테고리를 id로 찾고, 이에 매핑된 스티커들을 가져온다',
  })
  @Get('stickers/categories/:id')
  async fetchStickersByCategoryName(@Param('id') id: string) {
    return await this.stickerCategoriesService.fetchStickersByCategoryId({
      id,
    });
  }

  @ApiTags('어드민 API')
  @ApiOperation({
    summary: '[어드민용] 스티커 카테고리 생성',
    description: '[어드민 전용] 스티커 카테고리를 만든다.',
  })
  @ApiOkResponse({ description: '생성 완료', type: StickerCategory })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Post('users/admin/stickers/categories')
  async createCategory(
    @Req() req: Request,
    @Body() body: CreateStickerCategoryInput,
  ) {
    const kakaoId = req.user.userId;
    return await this.stickerCategoriesService.createCategory({
      kakaoId,
      ...body,
    });
  }

  @ApiTags('어드민 API')
  @ApiOperation({
    summary: '[어드민용] 스티커와 카테고리 매핑',
    description: '[어드민 전용] 스티커에 카테고리를 매핑한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Post('users/admin/stickers/map')
  async mapCategory(
    @Req() req: Request,
    @Body() mapCategoryDto: BulkMapCategoryDto,
  ) {
    const kakaoId = req.user.userId;
    return await this.stickerCategoriesService.mapCategory({
      kakaoId,
      ...mapCategoryDto,
    });
  }
}
