import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/APIs/posts/entities/posts.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { NotType } from 'src/common/enums/not-type.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Notification {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '알림을 생성한 유저 정보', type: User })
  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ description: '알림을 생성한 유저 FK', type: Number })
  @Column()
  @RelationId((notification: Notification) => notification.user)
  userKakaoId: number;

  @ApiProperty({ description: '알림을 받는 유저 정보', type: User })
  @JoinColumn()
  @ManyToOne(() => User)
  targetUser: User;

  @ApiProperty({ description: '알림을 받는 유저 FK', type: Number })
  @Column()
  @RelationId((notification: Notification) => notification.targetUser)
  targetUserKakaoId: number;

  @ApiProperty({ description: '알림의 유형', type: 'enum', enum: NotType })
  @Column()
  type: NotType;

  @ApiProperty({ description: '알림 체크 여부', type: Boolean, default: false })
  @Column({ default: false })
  is_checked: boolean;

  @ApiProperty({ description: '생성된 날짜', type: Date })
  @CreateDateColumn()
  date_created: Date;

  @ApiProperty({ description: '삭제된 날짜', type: Date })
  @DeleteDateColumn()
  date_deleted: Date;

  @ApiProperty({
    type: Number,
    description: '알림이 발생한 게시글 id(nullable)',
  })
  @Column({ nullable: true })
  @RelationId((notification: Notification) => notification.post)
  postId: number;

  @ApiProperty({
    type: Posts,
    description: '알림이 발생한 게시물',
    nullable: true,
  })
  @JoinColumn()
  @ManyToOne(() => Posts, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }) // 게시물을 참조하는 경우
  post: Posts;
}
