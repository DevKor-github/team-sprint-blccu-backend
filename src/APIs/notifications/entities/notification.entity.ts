import { User } from 'src/APIs/users/entities/user.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @RelationId((notification: Notification) => notification.user)
  userKakaoId: number;

  @JoinColumn()
  @ManyToOne(() => User)
  targetUser: User;

  @RelationId((notification: Notification) => notification.targetUser)
  targetUserKakaoId: number;

  @Column()
  not_type: number;

  @Column()
  not_url: string;

  @Column()
  not_message: string;

  @CreateDateColumn()
  date_created: Date;

  @DeleteDateColumn()
  date_deleted: Date;

  @Column()
  is_checked: boolean;
}
