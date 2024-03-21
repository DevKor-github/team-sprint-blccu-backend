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
export class StickerCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Sticker)
  @JoinColumn()
  sticker: Sticker;

  @Column()
  @RelationId((stickerCategory: StickerCategory) => stickerCategory.sticker)
  stickerId: string;
}
