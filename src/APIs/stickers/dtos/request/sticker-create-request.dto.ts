import { ApiProperty } from '@nestjs/swagger';

export class StickerCreateRequestDto {
  @ApiProperty({ description: '유저의 아이디', type: Number })
  userId: number;

  file: Express.Multer.File;
}
