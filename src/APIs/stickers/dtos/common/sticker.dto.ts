import { OmitType } from '@nestjs/swagger';
import { Sticker } from '../../entities/sticker.entity';

export class StickerDto extends OmitType(Sticker, ['user', 'stickerBlocks']) {}
