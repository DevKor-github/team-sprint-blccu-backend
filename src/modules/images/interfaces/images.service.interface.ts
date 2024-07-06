export interface IImagesServiceUploadImage {
  file: Express.Multer.File;
  resize: number;
  ext: 'jpg' | 'png';
}

export interface IImagesServiceDeleteImage {
  url: string;
}
