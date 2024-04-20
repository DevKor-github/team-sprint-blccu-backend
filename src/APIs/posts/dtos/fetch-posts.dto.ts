import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageRequest } from '../../../utils/pages/page-request';
import { ApiProperty } from '@nestjs/swagger';
import { PostsOrderOptionWrap } from 'src/commons/enums/posts-order-option';
import { PostsFilterOptionWrap } from 'src/commons/enums/posts-filter-option';

export class FetchPostsDto extends PageRequest {
  @ApiProperty({
    description: '페이지 정렬 옵션(default = TIME)',
    type: 'enum',
    enum: PostsOrderOptionWrap,
    required: false,
  })
  @IsOptional()
  @IsEnum(PostsOrderOptionWrap)
  order: PostsOrderOptionWrap = PostsOrderOptionWrap.DATE;

  @ApiProperty({
    description: '페이지 검색 옵션(default = TITLE)',
    type: 'enum',
    enum: PostsFilterOptionWrap,
    required: false,
  })
  @IsOptional()
  @IsEnum(PostsFilterOptionWrap)
  filter: PostsFilterOptionWrap = PostsFilterOptionWrap.TITLE;

  @ApiProperty({
    description: '검색할 내용',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string = '%';
}

export const FETCH_POST_OPTION = {
  id: true,
  postBackground: { id: true, image_url: true },
  postCategory: { id: true, name: true },
  user: {
    kakaoId: true,
    isAdmin: true,
    username: true,
    description: true,
    profile_image: true,
    date_created: true,
    date_deleted: true,
  },
  title: true,
  image_url: true,
  main_image_url: true,
  isPublished: true,
  like_count: true,
  allow_comment: true,
  scope: true,
  date_created: true,
  date_updated: true,
};
