import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { User } from 'src/APIs/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { AgreementType } from 'src/common/enums/agreement-type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Agreement extends CommonEntity {
  @ApiProperty({ type: Number, description: 'PK: A_I_' })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ type: () => User, description: '약관 동의를 한 유저' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({ type: Number, description: '약관에 동의한 유저 id' })
  @Column({ name: 'user_id' })
  @RelationId((agreement: Agreement) => agreement.user)
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: 'enum',
    enum: AgreementType,
    description: '약관의 종류',
    nullable: false,
  })
  @Column({ name: 'agreement_type' })
  @IsEnum(AgreementType)
  agreementType: AgreementType;

  @ApiProperty({ type: Boolean, description: '약관 동의 유무', default: false })
  @Column({ name: 'is_agreed', default: false })
  @IsBoolean()
  isAgreed: boolean; // 동의 여부, 기본값은 false
}
