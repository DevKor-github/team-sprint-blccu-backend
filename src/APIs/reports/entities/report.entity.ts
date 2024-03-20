import { User } from 'src/APIs/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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

  @RelationId((report: Report) => report.user)
  userKakaoId: number;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @Column()
  report_url: string;
}
