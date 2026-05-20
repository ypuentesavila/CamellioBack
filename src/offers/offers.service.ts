import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CounterOfferDto } from './dto/counter-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepo: Repository<Offer>,
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
  ) {}

  async findAll(filters: { jobId?: string; workerId?: string; employerId?: string }) {
    const where: Record<string, any> = {};
    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.workerId) where.workerId = filters.workerId;
    if (filters.employerId) where.employerId = filters.employerId;

    return this.offersRepo.find({
      where,
      relations: { worker: { workerProfile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateOfferDto, workerId: string) {
    const job = await this.jobsRepo.findOne({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('Job not found');

    const offer = this.offersRepo.create({ ...dto, workerId });
    const saved = await this.offersRepo.save(offer);

    await this.jobsRepo.update({ id: dto.jobId }, { offerCount: job.offerCount + 1 });

    return saved;
  }

  async accept(offerId: string, requesterId: string) {
    const offer = await this.offersRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.employerId !== requesterId) throw new ForbiddenException();

    await this.offersRepo.update(
      { jobId: offer.jobId, id: Not(offerId) },
      { status: 'rejected' },
    );
    await this.offersRepo.update({ id: offerId }, { status: 'accepted' });
    await this.jobsRepo.update(
      { id: offer.jobId },
      { status: 'in_progress', acceptedOfferId: offerId },
    );

    return { success: true };
  }

  async reject(offerId: string, requesterId: string) {
    const offer = await this.offersRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.employerId !== requesterId) throw new ForbiddenException();
    await this.offersRepo.update({ id: offerId }, { status: 'rejected' });
    return { success: true };
  }

  async withdraw(offerId: string, requesterId: string) {
    const offer = await this.offersRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.workerId !== requesterId) throw new ForbiddenException();
    await this.offersRepo.update({ id: offerId }, { status: 'withdrawn' });
    return { success: true };
  }

  async counter(offerId: string, dto: CounterOfferDto, requesterId: string) {
    const offer = await this.offersRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Offer not found');

    const isParticipant =
      offer.employerId === requesterId || offer.workerId === requesterId;
    if (!isParticipant) throw new ForbiddenException();

    await this.offersRepo.update(
      { id: offerId },
      {
        status: 'negotiating',
        counterOfferPrice: dto.price,
        counterOfferNote: dto.note,
        negotiationRound: offer.negotiationRound + 1,
      },
    );
    return this.offersRepo.findOne({ where: { id: offerId } });
  }
}
