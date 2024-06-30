import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { StickerCategory } from './stickerCategory.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StickerCategoryMapper {
  @ApiProperty({ type: Number, description: '스티커 아이디' })
  @PrimaryColumn()
  @RelationId(
    (stickerCategoryMapper: StickerCategoryMapper) =>
      stickerCategoryMapper.sticker,
  )
  stickerId: number;

  @JoinColumn()
  @ManyToOne(() => Sticker, (stickers) => stickers.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  sticker: Sticker;

  @ApiProperty({ type: Number, description: '스티커 카테고리 아이디' })
  @PrimaryColumn()
  @RelationId(
    (stickerCategoryMapper: StickerCategoryMapper) =>
      stickerCategoryMapper.stickerCategory,
  )
  stickerCategoryId: number;

  @JoinColumn()
  @ManyToOne(
    () => StickerCategory,
    (stickerCategories) => stickerCategories.id,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  stickerCategory: StickerCategory;
}
