import { StickerCategoryMapperDto } from '../dtos/common/stickerCategoryMapper.dto';

export interface IStickerCategoriesServiceMapCategory {
  userId: number;
  maps: StickerCategoryMapperDto[];
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
