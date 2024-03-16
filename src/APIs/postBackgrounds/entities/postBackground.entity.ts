import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostBackground {
  @ApiProperty({ description: 'PK: uuid', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, description: '이미지가 저장된 url' })
  @Column()
  image_url: string;
}
