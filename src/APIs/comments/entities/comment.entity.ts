import { Post } from 'src/APIs/posts/entities/posts.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (users) => users.kakaoId, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (posts) => posts.id, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ length: 15 })
  username: string;

  @Column({ length: 1500 })
  content: string;

  @Column()
  blame_count: number;

  @ManyToOne(() => Comment, (comment) => comment.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @CreateDateColumn()
  date_created: Date;

  @UpdateDateColumn()
  date_updated: Date;

  @DeleteDateColumn()
  date_deleted: Date;
}
