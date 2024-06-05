import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateStickerBlockInput } from './create-stickerBlock.dto';

export class CreateStickerBlocksInput {
  @ApiProperty({ type: [CreateStickerBlockInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStickerBlockInput)
  stickerBlocks: CreateStickerBlockInput[];
}

export class CreateStickerBlocksDto {
  stickerBlocks: CreateStickerBlockInput[];
  postsId: number;
  kakaoId: number;
}
