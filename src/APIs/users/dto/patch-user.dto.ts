import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PatchUserDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  kakaoId?: number;

  @ApiProperty({
    description: 'username 변경',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'description 변경',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
