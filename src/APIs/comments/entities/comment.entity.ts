import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/articles/entities/articles.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @ApiProperty({ type: Number, description: '댓글 id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Number, description: '작성자 유저 아이디' })
  @Column()
  @RelationId((comment: Comment) => comment.user)
  userKakaoId: number;

  @ApiProperty({ type: User, description: '사용자 정보' })
  @ManyToOne(() => User, (users) => users.kakaoId, { nullable: false })
  @JoinColumn()
  user: User;

  @ApiProperty({ type: Number, description: '게시글 id' })
  @Column()
  @RelationId((comment: Comment) => comment.posts)
  postsId: number;

  @ApiProperty({ type: Posts, description: '게시글 정보' })
  @ManyToOne(() => Posts, (posts) => posts.id, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  posts: Posts;

  @ApiProperty({ type: String, description: '내용 정보' })
  @Column({ length: 1500 })
  content: string;

  @ApiProperty({ type: Number, description: '신고 당한 횟수' })
  @Column({ default: 0 })
  report_count: number;

  @ApiProperty({ type: Comment, description: '루트 댓글 정보' })
  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  parent: Comment;

  @ApiProperty({ type: Number, description: '루트 댓글 아이디' })
  @Column({ nullable: true })
  @RelationId((comment: Comment) => comment.parent)
  parentId: number;

  @ApiProperty({ type: [Comment], description: '자식 댓글 정보' })
  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @Index()
  @ApiProperty({ type: Date, description: '생성 날짜' })
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  date_created: Date;

  @ApiProperty({ type: Date, description: '수정 날짜' })
  @UpdateDateColumn()
  date_updated: Date;

  @ApiProperty({ type: Date, description: '논리 삭제 칼럼', nullable: true })
  @DeleteDateColumn()
  date_deleted: Date;
}
