import { Posts } from 'src/APIs/posts/entities/posts.entity';
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
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @RelationId((comment: Comment) => comment.user)
  userKakaoId: number;

  @ManyToOne(() => User, (users) => users.kakaoId, { nullable: false })
  @JoinColumn()
  user: User;

  @RelationId((comment: Comment) => comment.posts)
  postsId: number;

  @ManyToOne(() => Posts, (posts) => posts.id, { nullable: false })
  @JoinColumn()
  posts: Posts;

  @Column({ length: 15 })
  username: string;

  @Column({ length: 1500 })
  content: string;

  @Column()
  blame_count: number;

  @ManyToOne(() => Comment, (comment) => comment.children)
  @JoinColumn()
  parent: Comment;

  @RelationId((comment: Comment) => comment.parent)
  parentId: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @CreateDateColumn()
  date_created: Date;

  @UpdateDateColumn()
  date_updated: Date;

  @DeleteDateColumn()
  date_deleted: Date;
}
