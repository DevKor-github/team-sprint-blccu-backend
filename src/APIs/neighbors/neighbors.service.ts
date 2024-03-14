import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighbor } from './entities/neighbor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NeighborsService {
  constructor(
    @InjectRepository(Neighbor)
    private readonly neighborsRepository: Repository<Neighbor>,
  ) {}

  async followUser({ kakaoId, follow_id }) {
    const neighbor = await this.neighborsRepository.save({
      from_user: kakaoId,
      to_user: follow_id,
    });
    return neighbor;
  }
}
