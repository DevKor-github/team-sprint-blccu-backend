import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { StickerCategory } from './stickerCategory.entity';

@Entity()
export class StickerCategoryMapper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @RelationId(
    (stickerCategoryMapper: StickerCategoryMapper) =>
      stickerCategoryMapper.sticker,
  )
  stickerId: number;

  @JoinColumn()
  @ManyToOne(() => Sticker, (stickers) => stickers.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sticker: Sticker;

  @Column()
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  stickerCategory: StickerCategory;
}
