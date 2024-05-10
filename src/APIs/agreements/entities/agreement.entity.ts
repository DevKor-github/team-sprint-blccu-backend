import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { User } from 'src/APIs/users/entities/user.entity';
import { AgreementType } from 'src/common/enums/agreement-type.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Agreement {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => User, (users) => users.kakaoId, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({ type: Number, description: '약관에 동의한 유저 id' })
  @RelationId((agreement: Agreement) => agreement.user)
  @IsNumber()
  userKakaoId: number;

  @ApiProperty({
    type: 'enum',
    enum: AgreementType,
    description: '약관의 종류',
  })
  @Column()
  @IsEnum(AgreementType)
  agreementType: AgreementType;

  @ApiProperty({ type: Boolean, description: '약관 동의 유무' })
  @Column({ default: false })
  @IsBoolean()
  isAgreed: boolean; // 동의 여부, 기본값은 false

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
