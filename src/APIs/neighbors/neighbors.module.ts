import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighbor } from './entities/neighbor.entity';
import { NeighborsService } from './neighbors.service';
import { NeighborsController } from './neighbors.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Neighbor])],
  providers: [NeighborsService, JwtStrategy],
  controllers: [NeighborsController],
})
export class NeighborsModule {}
