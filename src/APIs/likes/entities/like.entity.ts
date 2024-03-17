import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/posts/entities/posts.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @ApiProperty({ description: 'PK: uuid', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '좋아요를 누른 유저', type: User })
  @JoinColumn({ name: 'from_user' })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({
    description: '좋아요를 누른 포스트',
    type: Posts,
  })
  @JoinColumn({ name: 'post_id' })
  @ManyToOne(() => Posts)
  post: Posts;
}
