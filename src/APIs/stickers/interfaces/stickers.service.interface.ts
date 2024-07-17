import { StickerPatchRequestDto } from '../dtos/request/sticker-patch-request.dto';

export interface IStickersServiceCreateSticker {
  file: Express.Multer.File;
  userId: number;
}

export interface IStickersServiceId {
  stickerId: number;
}

export interface IStickersServiceDeleteSticker {
  stickerId: number;
  userId: number;
}

export interface IStickersServiceFindUserStickers {
  userId: number;
}

export interface IStickersServiceUpdateSticker extends StickerPatchRequestDto {
  userId: number;
  stickerId: number;
}
