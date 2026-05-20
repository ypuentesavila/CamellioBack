import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Job } from '../jobs/entities/job.entity';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Offer, User])],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
