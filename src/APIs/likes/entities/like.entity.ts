import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/posts/entities/posts.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Likes {
  // refactoring => pk 예측가능 값이어도 상관 없는 경우 A_I_로 하기
  @ApiProperty({ description: 'PK: uuid', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '좋아요를 누른 유저', type: User })
  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'NO ACTION', onDelete: 'CASCADE' })
  user: User;

  @RelationId((like: Likes) => like.user)
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
  @RelationId((like: Likes) => like.posts)
  postsId: number;
}
