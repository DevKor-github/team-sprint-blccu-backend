import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostCategoryResponseDto } from './dtos/create-post-category-response.dto';
import { PostCategoriesRepository } from './PostCategories.repository';

import {
  FetchPostCategoriesDto,
  FetchPostCategoryDto,
} from './dtos/fetch-post-category.dto';
import { FollowsService } from '../follows/follows.service';

@Injectable()
export class PostCategoriesService {
  constructor(
    private readonly followsService: FollowsService,
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

  async patch({ kakaoId, id, name }): Promise<FetchPostCategoryDto> {
    const data = await this.findWithId({ id });
    if (!data) throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    if (data.userKakaoId != kakaoId)
      throw new ForbiddenException('카테고리를 수정할 권한이 없습니다.');
    data.name = name;
    return await this.postCategoriesRepository.save(data);
  }

  async findWithId({ id }): Promise<FetchPostCategoryDto> {
    return await this.postCategoriesRepository.findOne({
      where: { id },
    });
  }

  async fetchAll({
    kakaoId,
    targetKakaoId,
  }): Promise<FetchPostCategoriesDto[]> {
    const scope = await this.followsService.getScope({
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
