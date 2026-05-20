import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { Offer } from '../offers/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Offer])],
  providers: [JobsService],
  controllers: [JobsController],
  exports: [TypeOrmModule],
})
export class JobsModule {}
