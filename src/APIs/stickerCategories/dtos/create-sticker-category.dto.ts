import { ApiProperty } from '@nestjs/swagger';

export class CreateStickerCategoryInput {
  @ApiProperty({ type: String, description: '스티커 이름' })
  name: string;
}
