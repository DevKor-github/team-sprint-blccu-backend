import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  // PrimaryColumn,
  // PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column({ type: 'bigint', primary: true })
  kakaoId: number;

  @Column({ default: '' })
  current_refresh_token: string;

  @Column()
  username: string;

  @Column({ default: '' })
  description: string;

  @Column()
  profile_image: string;

  @CreateDateColumn()
  date_created: Date;

  @DeleteDateColumn()
  date_deleted: Date;

  // @JoinTable({
  //   name: 'neighbor',
  //   joinColumns: [{ name: 'to_user' }],
  //   inverseJoinColumns: [{ name: 'from_user' }],
  // })
  // @ManyToMany(() => User, (users) => users.kakaoId)
  // neighbor: User[];
}
