import { CustomCursorPageOptionsDto } from '../dtos/cursor-page-option.dto';

export interface CustomCursorPageMetaDtoParameters {
  customCursorPageOptionsDto: CustomCursorPageOptionsDto;
  hasNextData: boolean;
  customCursor: string;
}
