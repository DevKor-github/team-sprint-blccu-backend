import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Article } from 'src/APIs/articles/entities/article.entity';
import { User } from 'src/APIs/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { NotType } from 'src/common/enums/not-type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Notification extends CommonEntity {
  @ApiProperty({ description: 'PK: A_I_', type: Number })
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '알림을 생성한 유저 정보', type: User })
  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: '알림을 생성한 유저 FK', type: Number })
  @Column({ name: 'user_id' })
  @RelationId((notification: Notification) => notification.user)
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '알림을 받는 유저 정보', type: User })
  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  targetUser: User;

  @ApiProperty({ description: '알림을 받는 유저 FK', type: Number })
  @Column({ name: 'target_user_id' })
  @RelationId((notification: Notification) => notification.targetUser)
  @IsNumber()
  targetUserId: number;

  @ApiProperty({ description: '알림의 유형', type: 'enum', enum: NotType })
  @Column()
  @IsEnum(NotType)
  type: NotType;

  @ApiProperty({ description: '알림 체크 여부', type: Boolean, default: false })
  @Column({ name: 'is_checked', default: false })
  @IsBoolean()
  isChecked: boolean;

  @ApiProperty({
    type: Number,
    description: '알림이 발생한 게시글 id(nullable)',
  })
  @Column({ name: 'article_id', nullable: true })
  @RelationId((notification: Notification) => notification.article)
  @IsNumber()
  articleId: number;

  @ApiProperty({
    type: Article,
    description: '알림이 발생한 게시물',
    nullable: true,
  })
  @JoinColumn()
  @ManyToOne(() => Article, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }) // 게시물을 참조하는 경우
  article: Article;
}
