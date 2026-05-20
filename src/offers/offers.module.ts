import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { Job } from '../jobs/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Job])],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [TypeOrmModule],
})
export class OffersModule {}
