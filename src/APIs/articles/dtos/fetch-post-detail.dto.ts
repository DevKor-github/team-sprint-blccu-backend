import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';
import { FetchCommentsDto } from 'src/APIs/comments/dtos/fetch-comments.dto';

export class fetchPostDetailDto {
  @ApiProperty({ type: PostResponseDto, description: '게시글 정보' })
  post: PostResponseDto;

  @ApiProperty({ type: [FetchCommentsDto], description: '댓글 정보' })
  comments: FetchCommentsDto[];
}
