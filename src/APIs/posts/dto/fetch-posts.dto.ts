import { PageRequest } from '../../../utils/page-request';

export class FetchPostsDto extends PageRequest {}

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
