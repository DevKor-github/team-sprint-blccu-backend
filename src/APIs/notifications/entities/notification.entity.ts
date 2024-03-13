import { Post } from 'src/APIs/posts/entities/posts.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user_id: User;

  @JoinColumn({ name: 'target_user_id' })
  @ManyToOne(() => User)
  target_user_id: User;

  @JoinColumn({ name: 'post_id' })
  @ManyToOne(() => Post)
  post_id: Post;

  @Column()
  not_type: number;

  @Column()
  not_url: string;

  @Column()
  not_message: string;

  @CreateDateColumn()
  date_created: Date;

  @Column()
  is_checked: boolean;
}
