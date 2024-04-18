import { IsArray } from 'class-validator';
import { CustomCursorPageMetaDto } from './cursor-page-meta.dto';

export class CustomCursorPageDto<T> {
  @IsArray()
  readonly data: T[];
  readonly meta: CustomCursorPageMetaDto;

  constructor(data: T[], meta: CustomCursorPageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
