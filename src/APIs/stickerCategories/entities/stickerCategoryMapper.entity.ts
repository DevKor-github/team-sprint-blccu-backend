import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { StickerCategory } from './stickerCategory.entity';

@Entity()
export class StickerCategoryMapper {
  @PrimaryColumn()
  @RelationId(
    (stickerCategoryMapper: StickerCategoryMapper) =>
      stickerCategoryMapper.sticker,
  )
  stickerId: number;

  @JoinColumn()
  @ManyToOne(() => Sticker, (stickers) => stickers.id, {
    onUpdate: 'CASCADE'
    onDelete: 'CASCADE',
  })
  sticker: Sticker;

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
