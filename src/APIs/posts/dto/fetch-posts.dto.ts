import { PageRequest } from '../../../utils/pages/page-request';

export class FetchPostsDto extends PageRequest {
  // @ApiProperty({
  //   description:
  //     '[공개 설정] PUBLIC: 전체공개, PROTECTED: 친구공개, PRIVATE: 비공개 // 상위 공개 범위는 함께 fetch 됨',
  //   type: 'enum',
  //   enum: OpenScope,
  // })
  // @IsEnum(OpenScope)
  // scope: OpenScope;
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
