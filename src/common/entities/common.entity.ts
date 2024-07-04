import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonEntity {
  @ApiProperty({ type: Date, description: '생성된 날짜' })
  @CreateDateColumn({ name: 'date_created' })
  dateCreated: Date;

  @ApiProperty({ type: Date, description: '수정된 날짜' })
  @UpdateDateColumn({ name: 'date_updated' })
  dateUpdated: Date;

  @ApiProperty({ type: Date, description: '삭제된 날짜' })
  @DeleteDateColumn({ name: 'date_deleted' })
  date_deleted: Date;
}
