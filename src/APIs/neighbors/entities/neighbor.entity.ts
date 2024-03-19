import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/APIs/users/dto/user-response.dto';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Neighbor {
  @ApiProperty({ type: String, description: 'PK: uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: UserResponseDto, description: '이웃 추가를 받은 유저' })
  @JoinColumn()
  @ManyToOne(() => User, (users) => users.kakaoId, { nullable: false })
  to_user: User;

  @ApiProperty({ type: UserResponseDto, description: '이웃 추가를 한 유저' })
  @JoinColumn()
  @ManyToOne(() => User, (users) => users.kakaoId, { nullable: false })
  from_user: User;

  @RelationId((neighbor: Neighbor) => neighbor.to_user) // you need to specify target relation
  toUserKakaoId: number;

  @RelationId((neighbor: Neighbor) => neighbor.from_user) // you need to specify target relation
  fromUserKakaoId: number;
}
