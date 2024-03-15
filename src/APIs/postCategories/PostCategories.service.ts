import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from './entities/postCategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostCategoriesService {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoriesRepository: Repository<PostCategory>,
  ) {}

  create({ kakaoId, name }) {
    return this.postCategoriesRepository.save({ user: kakaoId, name });
  }

  fetchAll({ kakaoId }) {
    return this.postCategoriesRepository.find({
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
