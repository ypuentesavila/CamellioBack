import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';

type ActivityEvent = {
  id: string;
  type: string;
  text: string;
  createdAt: Date;
};

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
    @InjectRepository(Offer) private offersRepo: Repository<Offer>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async getFeed(userId: string): Promise<ActivityEvent[]> {
    const jobs = await this.jobsRepo.find({
      where: { employerId: userId },
      order: { updatedAt: 'DESC' },
      take: 20,
    });

    const offers = await this.offersRepo.find({
      where: { employerId: userId },
      order: { updatedAt: 'DESC' },
      take: 20,
    });

    const workerIds = [...new Set(offers.map((o) => o.workerId))];
    const workers = workerIds.length
      ? await this.usersRepo.findBy({ id: In(workerIds) })
      : [];
    const workerMap = Object.fromEntries(workers.map((w) => [w.id, w.name]));

    const events: ActivityEvent[] = [];

    for (const offer of offers) {
      const workerName = workerMap[offer.workerId] ?? 'Trabajador';
      const price = offer.counterOfferPrice ?? offer.proposedPrice;

      if (offer.status === 'accepted') {
        events.push({
          id: `offer-accepted-${offer.id}`,
          type: 'offer_accepted',
          text: `${workerName} fue contratado — $${price.toLocaleString('es-CO')}`,
          createdAt: offer.updatedAt,
        });
      } else if (offer.status === 'negotiating') {
        events.push({
          id: `offer-negotiating-${offer.id}`,
          type: 'offer_negotiating',
          text: `${workerName} aceptó negociar precio — $${price.toLocaleString('es-CO')}`,
          createdAt: offer.updatedAt,
        });
      } else if (offer.status === 'pending') {
        events.push({
          id: `offer-new-${offer.id}`,
          type: 'offer_received',
          text: `${workerName} envió una propuesta — $${price.toLocaleString('es-CO')}`,
          createdAt: offer.createdAt,
        });
      }
    }

    for (const job of jobs) {
      if (job.status === 'completed') {
        events.push({
          id: `job-completed-${job.id}`,
          type: 'job_completed',
          text: `Trabajo "${job.title}" marcado como completado`,
          createdAt: job.updatedAt,
        });
      }
    }

    return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20);
  }
}
