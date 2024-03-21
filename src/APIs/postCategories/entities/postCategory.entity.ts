import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class PostCategory {
  @ApiProperty({ type: String, description: 'PK: uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, description: '카테고리 이름' })
  @Column({ nullable: false, default: '제목 없음' })
  name: string;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @RelationId((postCategory: PostCategory) => postCategory.user)
  userKakaoId: number;
}
