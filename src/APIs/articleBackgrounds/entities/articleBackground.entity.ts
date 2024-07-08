import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticleBackground extends CommonEntity {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, description: '이미지가 저장된 url' })
  @Column({ nullable: false, name: 'image_url' })
  imageUrl: string;

  @ApiProperty({
    type: () => [Article],
    description: '연결된 게시글',
    nullable: true,
  })
  @OneToMany(() => Article, (article) => article.articleBackground)
  articles: Article[];
}
