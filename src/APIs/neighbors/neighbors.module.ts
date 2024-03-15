import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighbor } from './entities/neighbor.entity';
import { NeighborsService } from './neighbors.service';
import { NeighborsController } from './neighbors.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Neighbor, User])],
  providers: [NeighborsService, JwtStrategy],
  controllers: [NeighborsController],
})
export class NeighborsModule {}
