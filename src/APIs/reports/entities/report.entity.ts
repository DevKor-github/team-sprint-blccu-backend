import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { Comment } from 'src/APIs/comments/entities/comment.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { ReportTarget } from 'src/common/enums/report-target.enum';
import { ReportType } from 'src/common/enums/report-type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Report extends CommonEntity {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ type: String, description: '신고 내용' })
  @Column()
  @IsString()
  content: string;

  @ApiProperty({ type: Number, description: '신고한 유저 id' })
  @Column({ name: 'user_id' })
  @RelationId((report: Report) => report.user)
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '신고를 한 유저', type: () => User })
  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: Number, description: '신고당한 유저 id' })
  @Column({ name: 'target_user_id' })
  @RelationId((report: Report) => report.targetUser)
  @IsNumber()
  targetUserId: number;

  @ApiProperty({ description: '신고를 당한 유저', type: () => User })
  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  targetUser: User;

  @IsEnum(ReportType)
  @ApiProperty({ type: 'enum', enum: ReportType, description: '신고 유형' })
  @Column()
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ type: 'enum', enum: ReportTarget, description: '신고 대상' })
  @Column()
  @IsEnum(ReportTarget)
  target: ReportTarget;

  @ApiProperty({ type: Number, description: '신고당한 게시글 id' })
  @Column({ name: 'article_id', nullable: true })
  @RelationId((report: Report) => report.article)
  @IsNumber()
  articleId: number;

  @ApiProperty({
    type: () => Article,
    description: '신고된 게시물',
    nullable: true,
  })
  @JoinColumn()
  @ManyToOne(() => Article, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }) // 게시물을 참조하는 경우
  article: Article;

  @ApiProperty({ type: Number, description: '신고당한 댓글 id' })
  @Column({ name: 'comment_id', nullable: true })
  @RelationId((report: Report) => report.comment)
  @IsNumber()
  commentId: number;

  @ApiProperty({
    type: () => Comment,
    description: '신고된 댓글',
    nullable: true,
  })
  @JoinColumn()
  @ManyToOne(() => Comment, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }) // 댓글을 참조하는 경우
  comment: Comment;
}
