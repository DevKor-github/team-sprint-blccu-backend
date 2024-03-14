import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;
}
