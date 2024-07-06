import { ApiProperty } from '@nestjs/swagger';
import { StickerBlocksCreateDto } from '../common/stickerBlocks.create.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StickerBlocksCreateRequestDto {
  @ApiProperty({ type: [StickerBlocksCreateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StickerBlocksCreateDto)
  stickerBlocks: StickerBlocksCreateDto[];
}
