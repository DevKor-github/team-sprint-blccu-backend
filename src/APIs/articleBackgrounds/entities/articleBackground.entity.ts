import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticleBackground {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, description: '이미지가 저장된 url' })
  @Column({ nullable: false })
  imageUrl: string;

  @OneToMany(() => Article, (article) => article.articleBackgroundId)
  articles: Article[];
}
