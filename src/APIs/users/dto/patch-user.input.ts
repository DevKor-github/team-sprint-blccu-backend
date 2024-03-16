import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PatchUserInput {
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
