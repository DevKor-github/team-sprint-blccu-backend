import { ApiProperty } from '@nestjs/swagger';
import { PostsOrderOptionWrap } from 'src/commons/enums/posts-order-option';
import { CustomCursorPageOptionsDto } from 'src/utils/cursor-pages/dtos/cursor-page-option.dto';

export class CursorFetchPosts extends CustomCursorPageOptionsDto {
  @ApiProperty({
    description: '정렬 옵션',
    type: 'enum',
    enum: PostsOrderOptionWrap,
    required: false,
    default: PostsOrderOptionWrap.DATE,
  })
  order?: PostsOrderOptionWrap = PostsOrderOptionWrap.DATE;
}
