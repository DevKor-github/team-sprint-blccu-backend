import { IsArray } from 'class-validator';
import { CustomCursorPageMetaDto } from './cursor-page-meta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CustomCursorPageDto<T> {
  @ApiProperty({ description: '조회된 데이터', type: [] })
  @IsArray()
  readonly data: T[];

  @ApiProperty({
    description: '페이지네이션 메타 데이터',
    type: CustomCursorPageMetaDto,
  })
  readonly meta: CustomCursorPageMetaDto;

  constructor(data: T[], meta: CustomCursorPageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
