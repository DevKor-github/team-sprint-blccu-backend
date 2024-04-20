import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from './entities/postCategory.entity';
import { Repository } from 'typeorm';
import { CreatePostCategoryResponseDto } from './dtos/create-post-category-response.dto';

@Injectable()
export class PostCategoriesService {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoriesRepository: Repository<PostCategory>,
  ) {}
  async findWithName({ kakaoId, name }) {
    return await this.postCategoriesRepository.find({
      where: { user: { kakaoId }, name },
    });
  }

  async create({ kakaoId, name }): Promise<CreatePostCategoryResponseDto> {
    const data = await this.findWithName({ kakaoId, name });
    console.log(data);
    if (data.length > 0) {
      throw new BadRequestException('이미 동명의 카테고리가 존재합니다.');
    }
    const result = await this.postCategoriesRepository.save({
      user: { kakaoId },
      name,
    });
    return result;
  }

  async fetchAll({ kakaoId }): Promise<PostCategory[]> {
    return await this.postCategoriesRepository.find({
      where: { user: { kakaoId } },
    });
  }

  delete({ kakaoId, id }) {
    return this.postCategoriesRepository.delete({
      id,
      user: { kakaoId },
    });
  }
}
