import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { User } from 'src/APIs/users/entities/user.entity';
import { FeedbackType } from 'src/common/enums/feedback-type.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Feedback {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @ApiProperty({ type: String, description: '피드백 내용' })
  @Column()
  content: string;

  @ApiProperty()
  @JoinColumn()
  @ManyToOne(() => User, (users) => users.kakaoId, {
    nullable: true,
    onUpdate: 'NO ACTION',
    onDelete: 'SET NULL',
  })
  user: User;

  @ApiProperty({ description: '피드백 종류', type: 'enum', enum: FeedbackType })
  @IsEnum(FeedbackType)
  @Column()
  type: FeedbackType;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: '피드백 보낸 유저의 카카오 아이디',
  })
  @Column({ nullable: true })
  @RelationId((feedback: Feedback) => feedback.user)
  userKakaoId: number;

  @ApiProperty({ type: Date, description: '생성한 날짜' })
  @CreateDateColumn()
  date_created: Date;

  @ApiProperty({ type: Date, description: '삭제한 날짜' })
  @DeleteDateColumn()
  date_deleted: Date;
}
