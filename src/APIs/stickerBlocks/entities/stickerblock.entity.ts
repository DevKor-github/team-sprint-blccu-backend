import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StickerBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'sticker_id' })
  @ManyToOne(() => Sticker, (stickers) => stickers.id)
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
