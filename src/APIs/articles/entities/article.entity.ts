import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ArticleBackground } from 'src/APIs/articleBackgrounds/entities/articleBackground.entity';
import { ArticleCategory } from 'src/APIs/articleCategories/entities/articleCategory.entity';
import { Comment } from 'src/APIs/comments/entities/comment.entity';
import { Notification } from 'src/APIs/notifications/entities/notification.entity';
import { Report } from 'src/APIs/reports/entities/report.entity';
import { StickerBlock } from 'src/APIs/stickerBlocks/entities/stickerblock.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { IndexedCommonEntity } from 'src/common/entities/indexed-common.entity';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Article extends IndexedCommonEntity {
  @ApiProperty({ description: '게시글의 고유 아이디', type: Number })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '연결된 카테고리 fk', type: Number })
  @Column({ name: 'article_category_id', nullable: true })
  @RelationId((article: Article) => article.articleCategory)
  @IsString()
  @IsOptional()
  articleCategoryId: number;

  @IsString()
  @ApiProperty({ description: '연결된 내지 fk', type: Number })
  @Column({ name: 'article_background_id', nullable: true })
  @RelationId((article: Article) => article.articleBackground)
  @IsString()
  @IsOptional()
  articleBackgroundId: number;

  @ApiProperty({ description: '작성한 유저 fk', type: Number })
  @Column({ name: 'user_id', nullable: false })
  @RelationId((article: Article) => article.user)
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '제목(최대 100자)', type: String, default: '' })
  @Column({ length: 100, default: '' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'html 적용된 제목', type: String, default: '' })
  @Column({ name: 'html_title', default: '' })
  @IsString()
  htmlTitle: string;

  @ApiProperty({
    description: '임시저장(false), 발행(true)',
    type: Boolean,
    default: false,
  })
  @Column({ name: 'is_published', default: false })
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ description: '좋아요 카운트', type: Number, default: 0 })
  @Column({ name: 'like_count', default: 0 })
  @IsNumber()
  likeCount: number;

  @ApiProperty({ description: '조회수 카운트', type: Number, default: 0 })
  @Column({ name: 'view_count', default: 0 })
  @IsNumber()
  viewCount: number;

  @ApiProperty({ description: '댓글수 카운트', type: Number, default: 0 })
  @Column({ name: 'comment_count', default: 0 })
  @IsNumber()
  commentCount: number;

  @ApiProperty({ description: '신고수 카운트', type: Number, default: 0 })
  @Column({ name: 'report_count', default: 0 })
  @IsNumber()
  reportCount: number;

  @ApiProperty({
    description: '댓글 허용 여부(boolean)',
    type: Boolean,
    default: true,
  })
  @Column({ name: 'allow_comment', default: true })
  @IsBoolean()
  allowComment: boolean;

  @ApiProperty({
    description:
      '[공개 설정] PUBLIC: 전체공개, PROTECTED: 친구공개, PRIVATE: 비공개',
    type: 'enum',
    enum: OpenScope,
    default: OpenScope.PUBLIC,
  })
  @Column({ default: OpenScope.PUBLIC })
  @IsEnum(OpenScope)
  scope: OpenScope;

  @ApiProperty({ description: '게시글 내용', type: String, default: '' })
  @Column('longtext', { default: '' })
  @IsString()
  content: string;

  @ApiProperty({
    description: '게시글 설명(html 태그 제외)',
    type: String,
    default: '',
  })
  @Column({ name: 'main_description', default: '' })
  @IsString()
  mainDescription: string;

  @ApiProperty({ description: '게시글 캡쳐 이미지 url', type: String })
  @Column({ name: 'image_url', default: '' })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ description: '게시글 대표 이미지 url', type: String })
  @Column({ name: 'main_image_url', default: '' })
  @IsUrl()
  mainImageUrl: string;

  @ApiProperty({ description: '연결된 카테고리', type: ArticleCategory })
  @ManyToOne(() => ArticleCategory, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  articleCategory: ArticleCategory;

  @ApiProperty({ description: '연결된 내지', type: ArticleBackground })
  @JoinColumn()
  @ManyToOne(() => ArticleBackground, {
    nullable: true,
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
  })
  articleBackground: ArticleBackground;

  @ApiProperty({ description: '작성자', type: User })
  @JoinColumn()
  @ManyToOne(() => User, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({
    type: () => [Comment],
    description: '연결된 댓글',
    nullable: true,
  })
  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @ApiProperty({
    type: () => [Notification],
    description: '연결된 알림',
    nullable: true,
  })
  @OneToMany(() => Notification, (notification) => notification.article)
  notifications: Notification[];

  @ApiProperty({
    type: () => [Report],
    description: '연결된 신고',
    nullable: true,
  })
  @OneToMany(() => Report, (report) => report.article)
  reports: Report[];

  @ApiProperty({
    type: () => [StickerBlock],
    description: '연결된 스티커블럭',
    nullable: true,
  })
  @OneToMany(() => StickerBlock, (stickerBlock) => stickerBlock.article)
  stickerBlocks: StickerBlock[];
}
