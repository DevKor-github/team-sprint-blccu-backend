import { User } from 'src/APIs/users/entities/user.entity';
import { ReportType } from 'src/commons/enums/report-type.enum';
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

  @Column()
  @RelationId((report: Report) => report.user)
  userKakaoId: number;

  @JoinColumn()
  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user: User;

  @Column()
  type: ReportType;

  @Column()
  url: string;
}
