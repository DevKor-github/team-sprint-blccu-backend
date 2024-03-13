import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  description: string;

  @Column()
  profile_image: string;

  @CreateDateColumn()
  date_created: Date;

  @DeleteDateColumn()
  date_deleted: Date;

  @JoinTable({
    name: 'neighbor',
    joinColumns: [{ name: 'to_user' }],
    inverseJoinColumns: [{ name: 'from_user' }],
  })
  @ManyToMany(() => User, (users) => users.id)
  neighbor: User;
}
