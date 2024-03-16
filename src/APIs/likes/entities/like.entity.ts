import { Post } from 'src/APIs/posts/entities/posts.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'from_user' })
  @ManyToOne(() => User)
  user: User;

  @JoinColumn({ name: 'post_id' })
  @ManyToOne(() => Post)
  post: Post;
}
