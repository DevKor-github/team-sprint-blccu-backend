import { MapCategoryDto } from '../dtos/map-category.dto';

export interface IStickerCategoriesServiceMapCategory {
  kakaoId: number;
  maps: MapCategoryDto[];
}

export interface IStickerCategoriesServiceId {
  id: number;
}

export interface IStickerCategoriesServiceName {
  name: string;
}

export interface IStickerCategoriesServiceCreateCategory {
  kakaoId: number;
  name: string;
}
