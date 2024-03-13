import { PostBackground } from 'src/APIs/postBackgrounds/entities/postBackground.entity';
import { PostCategory } from 'src/APIs/postCategories/entities/postCategory.entity';
import { PostImage } from 'src/APIs/postImages/entities/postImage.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PostCategory)
  @JoinColumn({ name: 'post_category_id' })
  postCategory: PostCategory;

  @JoinColumn({ name: 'post_image_id' })
  @ManyToOne(() => PostImage)
  postImage: PostImage;

  @JoinColumn({ name: 'post_background_id' })
  @ManyToOne(() => PostBackground)
  postBackground: PostBackground;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;

  @Column({ length: 100, nullable: false })
  title: string;

  @Column('longtext', { nullable: false })
  content: string;

  @Column({ default: 0 })
  like_count: number;

  @Column({ default: 0 })
  view_count: number;

  @Column({ default: true })
  allow_comment: boolean;

  @Column({ default: 0 })
  scope: number;

  @CreateDateColumn()
  date_created: Date;

  @UpdateDateColumn()
  date_updated: Date;

  @DeleteDateColumn()
  date_deleted: Date;
}
