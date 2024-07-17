import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Like extends CommonEntity {
  @ApiProperty({ description: 'PK: number', type: Number })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '좋아요를 누른 유저', type: () => User })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { onUpdate: 'NO ACTION', onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: '유저 아이디', type: Number })
  @Column({ name: 'user_id' })
  @RelationId((like: Like) => like.user)
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: '좋아요를 누른 게시글',
    type: () => Article,
  })
  @JoinColumn({ name: 'article_id' })
  @ManyToOne(() => Article, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  article: Article;

  @ApiProperty({
    type: Number,
    description: '게시글 아이디',
  })
  @Column({ name: 'article_id' })
  @RelationId((like: Like) => like.article)
  @IsNumber()
  articleId: number;
}
