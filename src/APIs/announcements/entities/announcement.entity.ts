import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Announcement extends CommonEntity {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, description: '공지 제목' })
  @Column()
  title: string;

  @ApiProperty({ type: String, description: '내용' })
  @Column()
  content: string;
}
