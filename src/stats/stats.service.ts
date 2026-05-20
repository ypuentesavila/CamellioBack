import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../offers/entities/offer.entity';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Offer) private offersRepo: Repository<Offer>,
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async workerStats(workerId: string) {
    const now = new Date();
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const acceptedOffers = await this.offersRepo.find({
      where: { workerId, status: 'accepted' },
    });

    const completedJobIds = await this.jobsRepo
      .find({ where: { status: 'completed' } })
      .then((jobs) => new Set(jobs.map((j) => j.id)));

    const completedOffers = acceptedOffers.filter((o) => completedJobIds.has(o.jobId));

    const thisMonthEarnings = completedOffers
      .filter((o) => new Date(o.updatedAt) >= startThisMonth)
      .reduce((s, o) => s + (o.counterOfferPrice ?? o.proposedPrice), 0);

    const lastMonthEarnings = completedOffers
      .filter((o) => {
        const d = new Date(o.updatedAt);
        return d >= startLastMonth && d < startThisMonth;
      })
      .reduce((s, o) => s + (o.counterOfferPrice ?? o.proposedPrice), 0);

    const activeJobsCount = acceptedOffers.filter(
      (o) => !completedJobIds.has(o.jobId),
    ).length;

    const earningsTrend =
      lastMonthEarnings > 0
        ? Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
        : 0;

    return {
      earningsThisMonth: thisMonthEarnings,
      earningsLastMonth: lastMonthEarnings,
      earningsTrend,
      activeJobsCount,
      completedJobsCount: completedOffers.length,
      averagePerJob:
        completedOffers.length > 0
          ? Math.round(
              completedOffers.reduce((s, o) => s + (o.counterOfferPrice ?? o.proposedPrice), 0) /
                completedOffers.length,
            )
          : 0,
    };
  }

  async employerStats(employerId: string) {
    const user = await this.usersRepo.findOne({ where: { id: employerId } });
    if (!user) throw new NotFoundException('User not found');

    const jobs = await this.jobsRepo.find({ where: { employerId } });
    const activeHires = jobs.filter((j) => j.status === 'in_progress').length;
    const completed = jobs.filter((j) => j.status === 'completed').length;

    const allOffers = await this.offersRepo.find({ where: { employerId } });
    const applicants = new Set(allOffers.map((o) => o.workerId)).size;

    return {
      jobsPosted: jobs.length,
      activeHires,
      completedJobs: completed,
      totalApplicants: applicants,
    };
  }
}
