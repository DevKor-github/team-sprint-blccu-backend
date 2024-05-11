import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement } from './entities/agreement.entity';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { AgreementsRepository } from './agreements.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Agreement])],
  controllers: [AgreementsController],
  providers: [AgreementsService, AgreementsRepository],
})
export class AgreementsModule {}
