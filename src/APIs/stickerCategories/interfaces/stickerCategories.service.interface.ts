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
