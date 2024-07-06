import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ArticleDeleteRequestDto {
  @ApiProperty({
    description: '물리 삭제 여부(nullable)',
    required: false,
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  isHardDelete?: boolean;
}
