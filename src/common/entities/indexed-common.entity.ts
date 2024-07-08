import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

export abstract class IndexedCommonEntity {
  @Index()
  @ApiProperty({ type: Date, description: '생성된 날짜' })
  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'date_created',
  })
  dateCreated: Date;

  @ApiProperty({ type: Date, description: '수정된 날짜' })
  @UpdateDateColumn({ name: 'date_updated' })
  dateUpdated: Date;

  @ApiProperty({ type: Date, description: '삭제된 날짜' })
  @DeleteDateColumn({ name: 'date_deleted' })
  dateDeleted: Date;
}
