import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Posts } from '../entities/article.entity';
import { CreateStickerBlocksResponseDto } from 'src/APIs/stickerBlocks/dtos/create-stickerBlocks.dto';

export class PublishPostResult extends OmitType(Posts, [
  'postBackground',
  'user',
  'postCategory',
]) {}

export class PublishPostDto {
  @ApiProperty({ type: [PublishPostResult] })
  postData: PublishPostResult;

  @ApiProperty({ type: [CreateStickerBlocksResponseDto] })
  stickerBlockData: CreateStickerBlocksResponseDto[];
}
