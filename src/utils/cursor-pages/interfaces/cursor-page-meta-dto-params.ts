import { CustomCursorPageOptionsDto } from '../dtos/cursor-page-option.dto';

export interface CustomCursorPageMetaDtoParameters {
  customCursorPageOptionsDto: CustomCursorPageOptionsDto;
  total: number;
  hasNextData: boolean;
  customCursor: string;
}
