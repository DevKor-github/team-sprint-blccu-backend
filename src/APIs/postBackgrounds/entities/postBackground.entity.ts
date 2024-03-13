import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostBackground {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image_url: string;
}
