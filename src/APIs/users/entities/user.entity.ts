import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';
import { Agreement } from 'src/APIs/agreements/entities/agreement.entity';
import { ArticleCategory } from 'src/APIs/articleCategories/entities/articleCategory.entity';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { Comment } from 'src/APIs/comments/entities/comment.entity';
import { Feedback } from 'src/APIs/feedbacks/entities/feedback.entity';
import { Follow } from 'src/APIs/follows/entities/follow.entity';
import { Like } from 'src/APIs/likes/entities/like.entity';
import { Notification } from 'src/APIs/notifications/entities/notification.entity';
import { Report } from 'src/APIs/reports/entities/report.entity';
import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Index('ngramUser', ['username'], { fulltext: true, parser: 'ngram' })
@Entity()
export class User extends CommonEntity {
  @ApiProperty({ description: 'PK: id', type: Number })
  @Column({ type: 'bigint', primary: true })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '유저 핸들러', type: String })
  @Column({ unique: true })
  @IsString()
  handle: string;

  @ApiProperty({ description: 'crypted refresh token', type: String })
  @Column({ name: 'current_refresh_token', default: '' })
  @IsString()
  currentRefreshToken: string;

  @ApiProperty({ description: '어드민 유저 여부', type: Boolean })
  @Column({ name: 'is_admin', default: false })
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({
    description: '팔로잉 수',
    type: Number,
    required: false,
    default: 0,
  })
  @Column({ name: 'following_count', default: 0 })
  @IsNumber()
  followingCount: number;

  @ApiProperty({
    description: '팔로워 수',
    type: Number,
    required: false,
    default: 0,
  })
  @Column({ name: 'follower_count', default: 0 })
  @IsNumber()
  followerCount: number;

  @ApiProperty({ description: '유저 이름', type: String, uniqueItems: true })
  @Column({ unique: true })
  @IsString()
  username: string;

  @ApiProperty({ description: '유저 설명', type: String, default: '' })
  @Column({ default: '' })
  @IsString()
  description: string;

  @ApiProperty({ description: '프로필 이미지 url', type: String, default: '' })
  @Column({ name: 'profile_image', default: '' })
  @IsUrl()
  profileImage: string;

  @ApiProperty({
    description: '프로필 배경 이미지 url',
    type: String,
    default: '',
  })
  @Column({ name: 'background_image', default: '' })
  @IsUrl()
  backgroundImage: string;

  @ApiProperty({
    type: () => [Agreement],
    description: '연결된 동의내역',
    nullable: true,
  })
  @OneToMany(() => Agreement, (agreement) => agreement.user)
  agreements: Agreement[];

  @ApiProperty({
    type: () => [Article],
    description: '연결된 게시글',
    nullable: true,
  })
  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @ApiProperty({
    type: () => [ArticleCategory],
    description: '연결된 게시글 카테고리',
    nullable: true,
  })
  @OneToMany(() => ArticleCategory, (articleCategory) => articleCategory.user)
  articleCategories: ArticleCategory[];

  @ApiProperty({
    type: () => [Comment],
    description: '연결된 댓글',
    nullable: true,
  })
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ApiProperty({
    type: () => [Feedback],
    description: '연결된 피드백',
    nullable: true,
  })
  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @ApiProperty({
    type: () => [Follow],
    description: '연결된 팔로잉',
    nullable: true,
  })
  @OneToMany(() => Follow, (follow) => follow.from_user)
  followings: Follow[];

  @ApiProperty({
    type: () => [Follow],
    description: '연결된 팔로워',
    nullable: true,
  })
  @OneToMany(() => Follow, (follow) => follow.to_user)
  followers: Follow[];

  @ApiProperty({
    type: () => [Like],
    description: '연결된 좋아요',
    nullable: true,
  })
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @ApiProperty({
    type: () => [Notification],
    description: '받은 알림',
    nullable: true,
  })
  @OneToMany(() => Notification, (notification) => notification.targetUser)
  receivedNotifications: Notification[];

  @ApiProperty({
    type: () => [Notification],
    description: '보낸 알림',
    nullable: true,
  })
  @OneToMany(() => Notification, (notification) => notification.user)
  sentNotifications: Notification[];

  @ApiProperty({
    type: () => [Report],
    description: '받은 신고',
    nullable: true,
  })
  @OneToMany(() => Report, (report) => report.targetUser)
  receivedReports: Report[];

  @ApiProperty({
    type: () => [Report],
    description: '보낸 신고',
    nullable: true,
  })
  @OneToMany(() => Report, (report) => report.user)
  sentReports: Report[];

  @ApiProperty({
    type: () => [Sticker],
    description: '연결된 스티커',
    nullable: true,
  })
  @OneToMany(() => Sticker, (sticker) => sticker.user)
  stickers: Sticker[];
}
