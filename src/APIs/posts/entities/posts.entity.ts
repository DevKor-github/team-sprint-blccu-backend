import { ApiProperty } from '@nestjs/swagger';
import { PostBackground } from 'src/APIs/postBackgrounds/entities/postBackground.entity';
import { PostCategory } from 'src/APIs/postCategories/entities/postCategory.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { OpenScope } from 'src/commons/enums/open-scope.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  // 이름 충돌 때문에 posts 복수형으로 사용
  @ApiProperty({ description: '포스트의 고유 아이디', type: Number })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({ description: '연결된 카테고리', type: PostCategory })
  @ManyToOne(() => PostCategory, { nullable: true })
  @JoinColumn({ name: 'post_category_id' })
  postCategory: PostCategory;

  @ApiProperty({ description: '연결된 내지', type: PostBackground })
  @JoinColumn({ name: 'post_background_id' })
  @ManyToOne(() => PostBackground, { nullable: true })
  postBackground: PostBackground;

  @ApiProperty({ description: '작성자', type: User })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ description: '제목(최대 100자)', type: String })
  @Column({ length: 100, default: '' })
  title: string;

  @ApiProperty({ description: '임시저장(false), 발행(true)', type: Boolean })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty({ description: '좋아요 카운트', type: Number })
  @Column({ default: 0 })
  like_count: number;

  @ApiProperty({ description: '조회수 카운트', type: Number })
  @Column({ default: 0 })
  view_count: number;

  @ApiProperty({ description: '댓글 허용 여부(boolean)', type: Boolean })
  @Column({ default: true })
  allow_comment: boolean;

  @ApiProperty({
    description:
      '[공개 설정] PUBLIC: 전체공개, PROTECTED: 친구공개, PRIVATE: 비공개',
    type: 'enum',
    enum: OpenScope,
  })
  @Column({ default: 'PUBLIC' })
  scope: OpenScope;

  @CreateDateColumn()
  date_created: Date;

  @UpdateDateColumn()
  date_updated: Date;

  @DeleteDateColumn()
  date_deleted: Date;
}
