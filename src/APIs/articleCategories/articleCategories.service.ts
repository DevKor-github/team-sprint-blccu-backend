import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowsService } from '../follows/follows.service';
import { ArticleCategoriesRepository } from './articleCategories.repository';
import { CreateArticleCategoryResponse } from './dtos/create-articleCategory.dto';
import {
  FetchArticleCategoriesResponse,
  FetchArticleCategoryResponse,
} from './dtos/fetch-articleCategory.dto';

@Injectable()
export class ArticleCategoriesService {
  constructor(
    private readonly followsService: FollowsService,
    private readonly articleCategoryRepository: ArticleCategoriesRepository,
  ) {}
  async findWithName({ kakaoId, name }) {
    return await this.articleCategoryRepository.find({
      where: { user: { kakaoId }, name },
    });
  }

  async create({ kakaoId, name }): Promise<CreateArticleCategoryResponse> {
    const data = await this.findWithName({ kakaoId, name });
    if (data.length > 0) {
      throw new BadRequestException('이미 동명의 카테고리가 존재합니다.');
    }
    const result = await this.articleCategoryRepository.save({
      user: { kakaoId },
      name,
    });
    return result;
  }

  async patch({ kakaoId, id, name }): Promise<FetchArticleCategoryResponse> {
    const data = await this.findWithId({ id });
    if (!data) throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    if (data.userId != kakaoId)
      throw new ForbiddenException('카테고리를 수정할 권한이 없습니다.');
    data.name = name;
    return await this.articleCategoryRepository.save(data);
  }

  async findWithId({ id }): Promise<FetchArticleCategoryResponse> {
    return await this.articleCategoryRepository.findOne({
      where: { id },
    });
  }

  async fetchAll({
    kakaoId,
    targetKakaoId,
  }): Promise<FetchArticleCategoriesResponse[]> {
    const scope = await this.followsService.getScope({
      from_user: targetKakaoId,
      to_user: kakaoId,
    });
    return await this.articleCategoryRepository.fetchUserCategory({
      userKakaoId: targetKakaoId,
      scope,
    });
  }

  delete({ kakaoId, id }) {
    return this.articleCategoryRepository.delete({
      id,
      user: { kakaoId },
    });
  }
}
