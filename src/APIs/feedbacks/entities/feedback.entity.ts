import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { User } from 'src/APIs/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { FeedbackType } from 'src/common/enums/feedback-type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Feedback extends CommonEntity {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ type: String, description: '피드백 내용' })
  @Column()
  @IsString()
  content: string;

  @ApiProperty({
    type: Number,
    description: '피드백 보낸 유저의 카카오 아이디',
  })
  @Column({ name: 'user_id', nullable: true })
  @RelationId((feedback: Feedback) => feedback.user)
  @IsNumber()
  userId: number;

  @ApiProperty({ type: () => User, description: '사용자 정보' })
  @ManyToOne(() => User, (users) => users.id, {
    nullable: true,
    onUpdate: 'NO ACTION',
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User;

  @ApiProperty({ description: '피드백 종류', type: 'enum', enum: FeedbackType })
  @Column()
  @IsEnum(FeedbackType)
  type: FeedbackType;
}
