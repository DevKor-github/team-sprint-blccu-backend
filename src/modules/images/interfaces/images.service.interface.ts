export interface IImagesServiceUploadImage {
  file: Express.Multer.File;
  resize: number;
  ext: 'jpg' | 'png';
  tag?: string;
}

export interface IImagesServiceDeleteImage {
  url: string;
}
