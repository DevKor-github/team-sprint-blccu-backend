import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  // PrimaryColumn,
  // PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @Column({ type: 'bigint', primary: true })
  @ApiProperty({ description: '카카오 id' })
  kakaoId: number;

  @Column({ default: '' })
  @ApiProperty({ description: 'crypted refresh token' })
  current_refresh_token: string;

  @Column({ default: false })
  @ApiProperty({ description: '어드민 유저 여부' })
  isAdmin: boolean;

  @Column()
  @ApiProperty({ description: '유저 이름' })
  username: string;

  @Column({ default: '' })
  @ApiProperty({ description: '유저 설명' })
  description: string;

  @Column()
  @ApiProperty({ description: '프로필 이미지 url' })
  profile_image: string;

  @Column({ default: '' })
  @ApiProperty({ description: '프로필 배경 이미지 url' })
  background_image: string;

  @CreateDateColumn()
  @ApiProperty({ description: '생성된 날짜' })
  date_created: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '삭제된 날짜' })
  date_deleted: Date;
}
