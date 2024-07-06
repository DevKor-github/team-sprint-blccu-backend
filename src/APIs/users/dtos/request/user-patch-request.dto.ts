import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PatchUserRequestDto {
  @ApiProperty({
    description: '[optional] 핸들러 변경',
    type: String,
    example: 'optional',
    required: false,
  })
  @IsString()
  @IsOptional()
  handle?: string;

  @ApiProperty({
    description: '[optional] username 변경',
    type: String,
    example: 'optional',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: '[optional] description 변경',
    type: String,
    example: 'optional',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
