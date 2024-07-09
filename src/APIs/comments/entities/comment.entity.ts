import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { Report } from 'src/APIs/reports/entities/report.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { IndexedCommonEntity } from 'src/common/entities/indexed-common.entity';
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
export class Comment extends IndexedCommonEntity {
  @ApiProperty({ type: Number, description: '댓글 id' })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ type: Number, description: '작성자 유저 아이디' })
  @Column({ name: 'user_id' })
  @RelationId((comment: Comment) => comment.user)
  @IsNumber()
  userId: number;

  @ApiProperty({ type: () => User, description: '사용자 정보' })
  @ManyToOne(() => User, (users) => users.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ type: Number, description: '게시글 id' })
  @Column({ name: 'article_id' })
  @RelationId((comment: Comment) => comment.article)
  @IsNumber()
  articleId: number;

  @ApiProperty({ type: () => Article, description: '게시글 정보' })
  @ManyToOne(() => Article, (article) => article.id, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ApiProperty({ type: String, description: '내용 정보', maxLength: 1500 })
  @Column({ length: 1500 })
  @IsString()
  content: string;

  @ApiProperty({ type: Number, description: '신고 당한 횟수', default: 0 })
  @Column({ name: 'report_count', default: 0 })
  @IsNumber()
  reportCount: number;

  @ApiProperty({ type: () => Comment, description: '루트 댓글 정보' })
  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @ApiProperty({ type: Number, description: '루트 댓글 아이디' })
  @Column({ name: 'parent_id', nullable: true })
  @RelationId((comment: Comment) => comment.parent)
  parentId: number;

  @ApiProperty({ type: () => [Comment], description: '자식 댓글 정보' })
  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @ApiProperty({
    type: () => [Report],
    description: '연결된 신고',
    nullable: true,
  })
  @OneToMany(() => Report, (report) => report.comment)
  reports: Report[];
}
