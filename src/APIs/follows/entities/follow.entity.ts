import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/APIs/users/dtos/user-response.dto';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Follow {
  @ApiProperty({ type: String, description: 'PK: uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: UserResponseDto, description: '이웃 추가를 받은 유저' })
  @JoinColumn()
  @ManyToOne(() => User, (users) => users.kakaoId, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  to_user: User;

  @ApiProperty({ type: UserResponseDto, description: '이웃 추가를 한 유저' })
  @JoinColumn()
  @ManyToOne(() => User, (users) => users.kakaoId, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  from_user: User;

  @ApiProperty({ type: Number, description: '이웃 추가를 받은 유저' })
  @RelationId((follow: Follow) => follow.to_user)
  toUserKakaoId: number;

  @ApiProperty({ type: Number, description: '이웃 추가를 한 유저' })
  @RelationId((follow: Follow) => follow.from_user)
  fromUserKakaoId: number;
}
