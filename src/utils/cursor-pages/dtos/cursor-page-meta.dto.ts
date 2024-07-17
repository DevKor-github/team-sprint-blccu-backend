import { ApiProperty } from '@nestjs/swagger';
import { CustomCursorPageMetaDtoParameters } from '../interfaces/cursor-page-meta-dto-params';

export class CustomCursorPageMetaDto {
  @ApiProperty({ description: '한번에 가져올 아이템 수', type: Number })
  readonly take: number;

  @ApiProperty({ description: '다음 페이지 존재 여부', type: Boolean })
  readonly hasNextData: boolean;

  @ApiProperty({ description: '커서 값', type: String })
  readonly customCursor: string;

  constructor({
    customCursorPageOptionsDto,
    hasNextData,
    customCursor,
  }: CustomCursorPageMetaDtoParameters) {
    this.take = customCursorPageOptionsDto.take;
    this.hasNextData = hasNextData;
    this.customCursor = customCursor;
  }
}
