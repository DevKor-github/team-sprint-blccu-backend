import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/APIs/users/entities/user.entity';
import { ReportType } from 'src/commons/enums/report-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Report {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, description: '신고 내용' })
  @Column()
  content: string;

  @ApiProperty({ type: Date, description: '생성된 날짜' })
  @CreateDateColumn()
  date_created: Date;

  @ApiProperty({ type: Number, description: '신고한 유저 id' })
  @Column()
  @RelationId((report: Report) => report.user)
  userKakaoId: number;

  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: Number, description: '신고당한 유저 id' })
  @Column()
  @RelationId((report: Report) => report.targetUser)
  targetUserKakaoId;

  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  targetUser: User;

  @ApiProperty({ type: 'enum', enum: ReportType, description: '신고 유형' })
  @Column()
  type: ReportType;

  @ApiProperty({ type: String, description: '신고가 발생한 게시물의 url' })
  @Column()
  url: string;
}
