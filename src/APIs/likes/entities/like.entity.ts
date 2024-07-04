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
export class Like {
  @ApiProperty({ description: 'PK: uuid', type: Number })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({ description: '좋아요를 누른 유저', type: User })
  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'NO ACTION', onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: '유저 아이디', type: Number })
  @Column()
  @RelationId((like: Like) => like.user)
  userKakaoId: number;

  @ApiProperty({
    description: '좋아요를 누른 포스트',
    type: Posts,
  })
  @JoinColumn()
  @ManyToOne(() => Posts, {
    nullable: false,
    onUpdate: 'NO ACTION',
    onDelete: 'CASCADE',
  })
  posts: Posts;

  @ApiProperty({
    type: Number,
    description: '게시글 아이디',
  })
  @Column()
  @RelationId((like: Like) => like.posts)
  postsId: number;
}
