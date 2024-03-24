import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/posts/entities/posts.entity';
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

  @ApiProperty({ description: '스티커의 depth', type: Number })
  @Column()
  depth: number;

  @ApiProperty({ description: '스티커의 fill', type: String })
  @Column()
  fill: string;

  @ApiProperty({ description: '스티커의 x좌표', type: String })
  @Column()
  x: string;

  @ApiProperty({ description: '스티커의 y좌표', type: String })
  @Column()
  y: string;

  @ApiProperty({ description: '스티커의 가로 폭', type: String })
  @Column()
  width: string;

  @ApiProperty({ description: '스티커의 세로 폭', type: String })
  @Column()
  height: string;
}
