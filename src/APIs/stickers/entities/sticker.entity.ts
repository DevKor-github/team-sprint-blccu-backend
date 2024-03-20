import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Sticker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @RelationId((sticker: Sticker) => sticker.user)
  userKakaoId: number;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @Column()
  image_url: string;
}
