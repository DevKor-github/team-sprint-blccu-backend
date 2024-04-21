import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostCategoryResponseDto } from './dtos/create-post-category-response.dto';
import { PostCategoriesRepository } from './PostCategories.repository';

import { FetchPostCategoryDto } from './dtos/fetch-post-category.dto';
import { NeighborsService } from '../neighbors/neighbors.service';

@Injectable()
export class PostCategoriesService {
  constructor(
    private readonly neighborsService: NeighborsService,
    private readonly postCategoriesRepository: PostCategoriesRepository,
  ) {}
  async findWithName({ kakaoId, name }) {
    return await this.postCategoriesRepository.find({
      where: { user: { kakaoId }, name },
    });
  }

  async create({ kakaoId, name }): Promise<CreatePostCategoryResponseDto> {
    const data = await this.findWithName({ kakaoId, name });
    if (data.length > 0) {
      throw new BadRequestException('이미 동명의 카테고리가 존재합니다.');
    }
    const result = await this.postCategoriesRepository.save({
      user: { kakaoId },
      name,
    });
    return result;
  }

  async fetchAll({ kakaoId, targetKakaoId }): Promise<FetchPostCategoryDto[]> {
    const scope = await this.neighborsService.getScope({
      from_user: targetKakaoId,
      to_user: kakaoId,
    });
    return await this.postCategoriesRepository.fetchUserCategory({
      userKakaoId: targetKakaoId,
      scope,
    });
  }

  delete({ kakaoId, id }) {
    return this.postCategoriesRepository.delete({
      id,
      user: { kakaoId },
    });
  }
}
