import { User } from 'src/APIs/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Neighbor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'to_user' })
  @ManyToOne(() => User, (users) => users.kakaoId, { nullable: false })
  to_user: User;

  @JoinColumn({ name: 'from_user' })
  @ManyToOne(() => User, (users) => users.kakaoId, { nullable: false })
  from_user: User;
}
