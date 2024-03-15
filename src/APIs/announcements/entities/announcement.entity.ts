import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  date_created: Date;

  @UpdateDateColumn()
  date_updated: Date;

  @DeleteDateColumn()
  date_deleted: Date;
}
