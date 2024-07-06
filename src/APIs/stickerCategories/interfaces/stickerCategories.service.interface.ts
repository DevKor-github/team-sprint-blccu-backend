import { MapCategoryDto } from '../dtos/map-category.dto';

export interface IStickerCategoriesServiceMapCategory {
  userId: number;
  maps: MapCategoryDto[];
}

export interface IStickerCategoriesServiceId {
  stickerCategoryId: number;
}

export interface IStickerCategoriesServiceName {
  name: string;
}

export interface IStickerCategoriesServiceCreateCategory {
  userId: number;
  name: string;
}
