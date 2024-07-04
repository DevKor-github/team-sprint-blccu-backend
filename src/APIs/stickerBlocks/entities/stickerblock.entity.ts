import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/articles/entities/articles.entity';
import { Sticker } from 'src/APIs/stickers/entities/sticker.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class StickerBlock {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '참조하는 스티커의 아이디', type: Number })
  @Column()
  @RelationId((stickerBlock: StickerBlock) => stickerBlock.sticker)
  stickerId: number;

  @ApiProperty({ description: '참조하는 스티커', type: Sticker })
  @JoinColumn()
  @ManyToOne(() => Sticker, (stickers) => stickers.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sticker: Sticker;

  @ApiProperty({ description: '참조하는 포스트 아이디', type: Number })
  @Column()
  @RelationId((stickerBlock: StickerBlock) => stickerBlock.posts)
  postsId: number;

  @ApiProperty({ description: '참조하는 포스트', type: Posts })
  @JoinColumn()
  @ManyToOne(() => Posts, (posts) => posts.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: Posts;

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
