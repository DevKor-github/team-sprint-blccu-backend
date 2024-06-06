import { MapCategoryDto } from '../dtos/map-category.dto';

export interface IStickerCategoriesServiceMapCategory {
  kakaoId: number;
  maps: MapCategoryDto[];
}
