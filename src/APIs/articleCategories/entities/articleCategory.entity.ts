import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
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
export class ArticleCategory extends CommonEntity {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ type: String, description: '카테고리 이름' })
  @Column({ nullable: false })
  @IsString()
  name: string;

  @ApiProperty({ type: () => User, description: '연결된 유저' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { onUpdate: 'NO ACTION', onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: Number, description: '유저 아이디' })
  @Column({ name: 'user_id' })
  @RelationId((articleCategory: ArticleCategory) => articleCategory.user)
  userId: number;

  @ApiProperty({
    type: () => [Article],
    description: '연결된 게시글',
    nullable: true,
  })
  @OneToMany(() => Article, (article) => article.articleCategory)
  articles: Article[];
}
