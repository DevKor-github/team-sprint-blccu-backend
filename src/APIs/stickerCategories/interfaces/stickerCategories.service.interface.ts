import { StickerCategoryMapperCreateRequestDto } from '../dtos/request/stickerCategoryMapper-create-request.dto';

export interface IStickerCategoriesServiceMapCategory {
  userId: number;
  maps: StickerCategoryMapperCreateRequestDto[];
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

export interface IStickerCategoriesServiceIds {
  stickerId: number;
  stickerCategoryId: number;
}

export interface IStickerCategoriesServiceUpdate {
  userId: number;
  name: string;
  stickerCategoryId: number;
}

export interface IStickerCategoriesServiceDeleteCategory {
  userId: number;
  stickerCategoryId: number;
}

export interface IStickerCategoriesServiceDeleteCategoryMapper {
  userId: number;
  stickerCategoryId: number;
  stickerId: number;
}
