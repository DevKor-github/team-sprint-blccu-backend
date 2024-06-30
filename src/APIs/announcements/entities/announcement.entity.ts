import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Announcement {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, description: '공지 제목' })
  @Column()
  title: string;

  @ApiProperty({ type: String, description: '내용' })
  @Column()
  content: string;

  @ApiProperty({ type: Date, description: '생성된 날짜' })
  @CreateDateColumn()
  date_created: Date;

  @ApiProperty({ type: Date, description: '수정된 날짜' })
  @UpdateDateColumn()
  date_updated: Date;

  @ApiProperty({ type: Date, description: '삭제된 날짜' })
  @DeleteDateColumn()
  date_deleted: Date;
}
