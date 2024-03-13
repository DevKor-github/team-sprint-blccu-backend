import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import { User } from 'src/APIs/users/entities/user.entity';
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

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (users) => users.id)
  user: User;

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
