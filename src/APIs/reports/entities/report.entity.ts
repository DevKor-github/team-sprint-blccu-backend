import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  date_created: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;
}
