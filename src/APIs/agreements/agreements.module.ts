import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement } from './entities/agreement.entity';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { AgreementsRepository } from './agreements.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agreement]), UsersModule],
  controllers: [AgreementsController],
  providers: [AgreementsService, AgreementsRepository],
})
export class AgreementsModule {}
