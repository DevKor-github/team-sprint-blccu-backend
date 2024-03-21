import { ApiProperty } from '@nestjs/swagger';

export class CreateStickerDto {
  @ApiProperty({ description: '유저의 카카오 아이디', type: Number })
  userKakaoId: number;

  file: Express.Multer.File;
}
