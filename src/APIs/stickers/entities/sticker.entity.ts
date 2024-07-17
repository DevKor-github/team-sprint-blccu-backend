import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsUrl } from 'class-validator';
import { StickerBlock } from 'src/APIs/stickerBlocks/entities/stickerblock.entity';
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
export class Sticker extends CommonEntity {
  @ApiProperty({ description: 'PK: A_I', type: Number })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '제작한 유저 fk', type: Number })
  @Column({ name: 'user_id' })
  @RelationId((sticker: Sticker) => sticker.user)
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '제작한 유저', type: () => User })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ApiProperty({
    description: '스티커 이미지 주소',
    type: String,
    nullable: false,
  })
  @Column({ name: 'image_url', nullable: false })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    description: '블꾸 기본 제공 스티커 유무',
    type: Boolean,
    default: false,
  })
  @Column({ name: 'is_default', nullable: false, default: false })
  @IsBoolean()
  isDefault: boolean;

  @ApiProperty({
    description: '재사용 가능 유무',
    type: Boolean,
    default: false,
  })
  @Column({ name: 'is_reusable', nullable: false, default: false })
  @IsBoolean()
  isReusable: boolean;

  @ApiProperty({
    type: () => [StickerBlock],
    description: '연결된 스티커블럭',
    nullable: true,
  })
  @OneToMany(() => StickerBlock, (stickerBlock) => stickerBlock.sticker)
  stickerBlocks: StickerBlock[];
}
