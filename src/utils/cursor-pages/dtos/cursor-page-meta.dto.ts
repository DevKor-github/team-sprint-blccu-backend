import { CustomCursorPageMetaDtoParameters } from '../interfaces/cursor-page-meta-dto-params';

export class CustomCursorPageMetaDto {
  readonly total: number;
  readonly take: number;
  readonly hasNextData: boolean;
  readonly customCursor: string;

  constructor({
    customCursorPageOptionsDto,
    total,
    hasNextData,
    customCursor,
  }: CustomCursorPageMetaDtoParameters) {
    this.take = customCursorPageOptionsDto.take;
    this.total = total;
    this.hasNextData = hasNextData;
    this.customCursor = customCursor;
  }
}
