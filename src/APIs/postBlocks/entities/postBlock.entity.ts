import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column()
  index: number;
}
