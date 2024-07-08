import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
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
export class StickerBlock extends CommonEntity {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '참조하는 스티커의 아이디', type: Number })
  @Column({ name: 'sticker_id' })
  @RelationId((stickerBlock: StickerBlock) => stickerBlock.sticker)
  @IsNumber()
  stickerId: number;

  @ApiProperty({ description: '참조하는 스티커', type: () => Sticker })
  @JoinColumn()
  @ManyToOne(() => Sticker, (stickers) => stickers.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sticker: Sticker;

  @ApiProperty({ description: '참조하는 포스트 아이디', type: Number })
  @Column({ name: 'article_id' })
  @RelationId((stickerBlock: StickerBlock) => stickerBlock.article)
  @IsNumber()
  articleId: number;

  @ApiProperty({ description: '참조하는 포스트', type: () => Article })
  @JoinColumn()
  @ManyToOne(() => Article, (article) => article.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  article: Article;

  @ApiProperty({ description: '스티커의 posX', type: Number })
  @Column({ type: 'float' })
  posX: number;

  @ApiProperty({ description: '스티커의 posY', type: Number })
  @Column({ type: 'float' })
  posY: number;

  @ApiProperty({ description: '스티커의 scale', type: Number })
  @Column({ type: 'float' })
  scale: number;

  @ApiProperty({ description: '스티커의 angle', type: Number })
  @Column({ type: 'float' })
  angle: number;

  @ApiProperty({ description: '스티커의 zindex', type: Number })
  @Column({ type: 'float' })
  zindex: number;

  @ApiProperty({ description: '스티커의 clientId', type: String })
  @Column()
  clientId: string;
}
