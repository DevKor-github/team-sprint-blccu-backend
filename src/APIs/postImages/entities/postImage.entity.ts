import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image_url: string;
}
