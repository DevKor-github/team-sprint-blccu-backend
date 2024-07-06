import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserDto } from 'src/APIs/users/dtos/common/user.dto';
import { User } from 'src/APIs/users/entities/user.entity';
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
export class Follow extends CommonEntity {
  @ApiProperty({ type: String, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ type: UserDto, description: '이웃 추가를 받은 유저' })
  @JoinColumn()
  @ManyToOne(() => User, (users) => users.id, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  toUser: User;

  @ApiProperty({ type: UserDto, description: '이웃 추가를 한 유저' })
  @JoinColumn()
  @ManyToOne(() => User, (users) => users.id, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  fromUser: User;

  @ApiProperty({ type: Number, description: '이웃 추가를 받은 유저' })
  @Column({ name: 'to_user_id' })
  @RelationId((follow: Follow) => follow.toUser)
  toUserId: number;

  @ApiProperty({ type: Number, description: '이웃 추가를 한 유저' })
  @Column({ name: 'from_user_id' })
  @RelationId((follow: Follow) => follow.fromUser)
  fromUserId: number;
}
