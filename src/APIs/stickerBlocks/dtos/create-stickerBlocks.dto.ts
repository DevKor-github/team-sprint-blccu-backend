import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateStickerBlockInput } from './create-stickerBlock.dto';

export class BulkInsertStickerInput extends CreateStickerBlockInput {
  @ApiProperty({ type: Number, description: '스티커의 id' })
  stickerId: number;
}

export class CreateStickerBlocksInput {
  @ApiProperty({ type: [BulkInsertStickerInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkInsertStickerInput)
  stickerBlocks: BulkInsertStickerInput[];
}

export class CreateStickerBlocksDto {
  stickerBlocks: BulkInsertStickerInput[];
  postsId: number;
  kakaoId: number;
}

export class CreateStickerBlocksResponseDto extends BulkInsertStickerInput {
  @ApiProperty({ type: Number, description: '게시글 아이디' })
  postsId: number;

  @ApiProperty({ type: Number, description: '스티커블록 아이디' })
  id: number;
}
