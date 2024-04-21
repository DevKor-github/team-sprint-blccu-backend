import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/posts/entities/posts.entity';
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

  @Column()
  @RelationId((postCategory: PostCategory) => postCategory.user)
  userKakaoId: number;
}
