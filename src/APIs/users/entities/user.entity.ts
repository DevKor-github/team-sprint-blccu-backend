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
  @ApiProperty({ description: '카카오 id', type: Number })
  kakaoId: number;

  @Column({ unique: true })
  @ApiProperty({ description: '유저 핸들러', type: String })
  handle: string;

  @Column({ default: '' })
  @ApiProperty({ description: 'crypted refresh token', type: String })
  current_refresh_token: string;

  @Column({ default: false })
  @ApiProperty({ description: '어드민 유저 여부', type: Boolean })
  isAdmin: boolean;

  @Column({ unique: true })
  @ApiProperty({ description: '유저 이름', type: String })
  username: string;

  @Column({ default: '' })
  @ApiProperty({ description: '유저 설명', type: String })
  description: string;

  @Column({ default: '' })
  @ApiProperty({ description: '프로필 이미지 url', type: String })
  profile_image: string;

  @Column({ default: '' })
  @ApiProperty({ description: '프로필 배경 이미지 url', type: String })
  background_image: string;

  @CreateDateColumn()
  @ApiProperty({ description: '생성된 날짜', type: Date })
  date_created: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '삭제된 날짜', type: Date })
  date_deleted: Date;
}
