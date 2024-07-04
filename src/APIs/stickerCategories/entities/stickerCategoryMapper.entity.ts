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
import { IsNumber } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity()
export class StickerCategoryMapper extends CommonEntity {
  @ApiProperty({ type: Number, description: '스티커 아이디' })
  @PrimaryColumn({ name: 'sticker_id' })
  @RelationId(
    (stickerCategoryMapper: StickerCategoryMapper) =>
      stickerCategoryMapper.sticker,
  )
  @IsNumber()
  stickerId: number;

  @JoinColumn()
  @ManyToOne(() => Sticker, (stickers) => stickers.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  sticker: Sticker;

  @ApiProperty({ type: Number, description: '스티커 카테고리 아이디' })
  @PrimaryColumn({ name: 'sticker_category_id' })
  @RelationId(
    (stickerCategoryMapper: StickerCategoryMapper) =>
      stickerCategoryMapper.stickerCategory,
  )
  @IsNumber()
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
