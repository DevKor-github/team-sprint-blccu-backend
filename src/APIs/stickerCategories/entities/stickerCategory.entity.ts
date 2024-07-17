import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StickerCategoryMapper } from './stickerCategoryMapper.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity()
export class StickerCategory extends CommonEntity {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '카테고리 이름', type: String })
  @Column({ nullable: false, unique: true })
  @IsString()
  name: string;

  @ApiProperty({
    type: () => [StickerCategoryMapper],
    description: '연결된 스티커 카테고리 매퍼',
    nullable: true,
  })
  @OneToMany(
    () => StickerCategoryMapper,
    (stickerCategoryMapper) => stickerCategoryMapper.stickerCategory,
  )
  stickerCategoryMappers: StickerCategoryMapper[];
}
