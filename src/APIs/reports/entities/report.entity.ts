import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Comment } from 'src/APIs/comments/entities/comment.entity';
import { Posts } from 'src/APIs/articles/entities/articles.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { ReportTarget } from 'src/common/enums/report-target.enum';
import { ReportType } from 'src/common/enums/report-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Report {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, description: '신고 내용' })
  @Column()
  content: string;

  @ApiProperty({ type: Date, description: '생성된 날짜' })
  @CreateDateColumn()
  date_created: Date;

  @ApiProperty({ type: Number, description: '신고한 유저 id' })
  @Column()
  @RelationId((report: Report) => report.user)
  userKakaoId: number;

  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: Number, description: '신고당한 유저 id' })
  @Column()
  @RelationId((report: Report) => report.targetUser)
  targetUserId: number;

  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  targetUser: User;

  @IsEnum(ReportType)
  @ApiProperty({ type: 'enum', enum: ReportType, description: '신고 유형' })
  @Column()
  type: ReportType;

  @IsEnum(ReportTarget)
  @ApiProperty({ type: 'enum', enum: ReportTarget, description: '신고 대상' })
  @Column()
  target: ReportTarget;

  @ApiProperty({ type: String, description: '신고가 발생한 게시물의 url' })
  @Column()
  url: string;

  @ApiProperty({ type: Number, description: '신고당한 게시글 id' })
  @Column({ nullable: true })
  @RelationId((report: Report) => report.post)
  postId: number;

  @ApiProperty({ type: Posts, description: '신고된 게시물', nullable: true })
  @JoinColumn()
  @ManyToOne(() => Posts, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }) // 게시물을 참조하는 경우
  post: Posts;

  @ApiProperty({ type: Number, description: '신고당한 댓글 id' })
  @Column({ nullable: true })
  @RelationId((report: Report) => report.comment)
  commentId: number;

  @ApiProperty({ type: Comment, description: '신고된 댓글', nullable: true })
  @JoinColumn()
  @ManyToOne(() => Comment, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }) // 댓글을 참조하는 경우
  comment: Comment;
}
