import { StickerBlock } from 'src/APIs/stickerBlocks/entities/stickerblock.entity';
import { PostResponseDto } from './post-response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class PostResponseDtoExceptCategory extends OmitType(PostResponseDto, [
  'postCategory',
]) {}
export class FetchPostForUpdateDto {
  @ApiProperty({
    description: '게시글 정보',
    type: PostResponseDtoExceptCategory,
  })
  post: PostResponseDtoExceptCategory;

  @ApiProperty({ description: '스티커 블록 배열', type: [StickerBlock] })
  stickerBlocks: StickerBlock[];
}
