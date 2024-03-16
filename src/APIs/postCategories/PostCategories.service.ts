import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from './entities/postCategory.entity';
import { Repository } from 'typeorm';
import { CreatePostCategoryResponseDto } from './dto/create-post-category-response.dto';

@Injectable()
export class PostCategoriesService {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoriesRepository: Repository<PostCategory>,
  ) {}

  async create({ kakaoId, name }): Promise<CreatePostCategoryResponseDto> {
    const result = await this.postCategoriesRepository.save({
      user: kakaoId,
      name,
    });
    result.user = BigInt(result.user);
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
