import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Sticker {
  @ApiProperty({ description: 'PK: uuid', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '제작한 유저 fk', type: Number })
  @Column()
  @RelationId((sticker: Sticker) => sticker.user)
  userKakaoId: number;

  @ApiProperty({ description: '제작한 유저', type: User })
  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  user: User;

  @ApiProperty({
    description: '스티커 이미지 주소',
    type: String,
    nullable: false,
  })
  @Column({ nullable: false })
  image_url: string;

  @Column({ nullable: false, default: false })
  isDefault: boolean;
}
