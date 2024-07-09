import { OmitType } from '@nestjs/swagger';
import { StickerCategoryMapperDto } from '../common/stickerCategoryMapper.dto';

export class StickerCategoryMapperCreateRequestDto extends OmitType(
  StickerCategoryMapperDto,
  ['dateCreated', 'dateDeleted', 'dateUpdated'],
) {}
