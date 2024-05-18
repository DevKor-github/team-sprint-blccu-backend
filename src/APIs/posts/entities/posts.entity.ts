import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PostBackground } from 'src/APIs/postBackgrounds/entities/postBackground.entity';
import { PostCategory } from 'src/APIs/postCategories/entities/postCategory.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  // 이름 충돌 때문에 posts 복수형으로 사용
  @ApiProperty({ description: '포스트의 고유 아이디', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @ApiProperty({ description: '연결된 카테고리 fk', type: String })
  @Column({ nullable: true })
  @RelationId((posts: Posts) => posts.postCategory)
  postCategoryId: string;

  @IsString()
  @ApiProperty({ description: '연결된 내지 fk', type: String })
  @Column({ nullable: true })
  @RelationId((posts: Posts) => posts.postBackground)
  postBackgroundId: string;

  @ApiProperty({ description: '작성한 유저 fk', type: Number })
  @Column({ nullable: false })
  @RelationId((posts: Posts) => posts.user)
  userKakaoId: number;

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

  @ApiProperty({ description: '댓글수 카운트', type: Number })
  @Column({ default: 0 })
  comment_count: number;

  @ApiProperty({ description: '신고수 카운트', type: Number })
  @Column({ default: 0 })
  report_count: number;

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

  @Index()
  @ApiProperty({ description: '생성된 날짜', type: Date })
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  date_created: Date;

  @ApiProperty({ description: '수정된 날짜', type: Date })
  @UpdateDateColumn()
  date_updated: Date;

  @ApiProperty({ description: 'soft delete column', type: Date })
  @DeleteDateColumn()
  date_deleted: Date;

  @ApiProperty({ description: '게시글 내용', type: String })
  @Column('longtext')
  content: string;

  @ApiProperty({ description: '게시글 설명(html 태그 제외)', type: String })
  @Column()
  main_description: string;

  @ApiProperty({ description: '게시글 캡쳐 이미지 url', type: String })
  @Column()
  image_url: string;

  @ApiProperty({ description: '게시글 대표 이미지 url', type: String })
  @Column()
  main_image_url: string;

  @ApiProperty({ description: '연결된 카테고리', type: PostCategory })
  @ManyToOne(() => PostCategory, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  postCategory: PostCategory;

  @ApiProperty({ description: '연결된 내지', type: PostBackground })
  @JoinColumn()
  @ManyToOne(() => PostBackground, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  postBackground: PostBackground;

  @ApiProperty({ description: '작성자', type: User })
  @JoinColumn()
  @ManyToOne(() => User, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;
}
