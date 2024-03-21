import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StickerCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;
}
