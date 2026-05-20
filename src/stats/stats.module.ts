import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Offer } from '../offers/entities/offer.entity';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Job, User])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
