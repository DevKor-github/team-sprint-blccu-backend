import { User } from 'src/APIs/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Neighbor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'from_user' })
  @ManyToOne(() => User)
  from_user: User;

  @JoinColumn({ name: 'to_user' })
  @ManyToOne(() => User)
  to_user: User;
}
