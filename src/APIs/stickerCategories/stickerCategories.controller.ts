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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { StickerCategoryCreateRequestDto } from './dtos/request/stickerCategory-create-request.dto';
import { StickerCategoriesMapDto } from './dtos/request/stickerCategories-map-request.dto';
import { StickerCategoryMapperDto } from './dtos/common/stickerCategoryMapper.dto';
import { StickerCategoryDto } from './dtos/common/stickerCategory.dto';
import { StickersCategoryFetchStickersResponseDto } from './dtos/response/stickerCategories-fetch-stickers-response.dto';
import { StickerCategoriesDocs } from './docs/stickerCategories-docs.decorator';

@StickerCategoriesDocs
@ApiTags('스티커 API')
@Controller()
export class StickerCategoriesController {
  constructor(
    private readonly stickerCategoriesService: StickerCategoriesService,
  ) {}

  @Get('stickers/categories')
  async fetchCategories(): Promise<StickerCategoryDto[]> {
    return await this.stickerCategoriesService.fetchCategories();
  }

  @Get('stickers/categories/:stickerCategoryId')
  async fetchStickersByCategoryName(
    @Param('stickerCategoryId') stickerCategoryId: number,
  ): Promise<StickersCategoryFetchStickersResponseDto[]> {
    return await this.stickerCategoriesService.fetchStickersByCategoryId({
      stickerCategoryId,
    });
  }

  @UseGuards(AuthGuardV2)
  @Post('users/admin/stickers/categories')
  async createCategory(
    @Req() req: Request,
    @Body() body: StickerCategoryCreateRequestDto,
  ): Promise<StickerCategoryDto> {
    const userId = req.user.userId;
    return await this.stickerCategoriesService.createCategory({
      userId,
      ...body,
    });
  }

  @UseGuards(AuthGuardV2)
  @Post('users/admin/stickers/map')
  async mapCategory(
    @Req() req: Request,
    @Body() mapCategoryDto: StickerCategoriesMapDto,
  ): Promise<StickerCategoryMapperDto[]> {
    const userId = req.user.userId;
    return await this.stickerCategoriesService.mapCategory({
      userId,
      ...mapCategoryDto,
    });
  }
}
