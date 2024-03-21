import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class StickerBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @RelationId((stickerBlock: StickerBlock) => stickerBlock.sticker)
  stickerId: number;

  @JoinColumn()
  @ManyToOne(() => Sticker, (stickers) => stickers.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sticker: Sticker;

  @Column()
  depth: number;

  @Column()
  fill: string;

  @Column('point')
  x: string;

  @Column('point')
  y: string;

  @Column()
  width: string;

  @Column()
  height: string;
}
