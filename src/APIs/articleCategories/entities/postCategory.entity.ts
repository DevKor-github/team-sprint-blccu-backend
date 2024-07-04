import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/articles/entities/articles.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class PostCategory {
  @ApiProperty({ type: String, description: 'PK: uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, description: '카테고리 이름' })
  @Column({ nullable: false })
  name: string;

  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'NO ACTION', onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Posts, (posts) => posts.postCategory)
  posts: Posts;

  @ApiProperty({ type: Number, description: '유저 아이디' })
  @Column()
  @RelationId((postCategory: PostCategory) => postCategory.user)
  userKakaoId: number;
}
