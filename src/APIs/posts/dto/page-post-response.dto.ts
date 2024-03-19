import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';

export class PagePostResponseDto {
  @ApiProperty({ description: '한 페이지 당 아이템 갯수', type: Number })
  pageSize: number;

  @ApiProperty({ description: '전체 아이템 갯수', type: Number })
  totalCount: number;

  @ApiProperty({ description: '요청할 페이지 번호', type: Number })
  totalPage: number;

  @ApiProperty({ description: '조회된 포스트', type: [PostResponseDto] })
  items: PostResponseDto[];
}
