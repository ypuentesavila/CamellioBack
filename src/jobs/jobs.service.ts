import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { Offer } from '../offers/entities/offer.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { PatchStatusDto } from './dto/patch-status.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
    @InjectRepository(Offer) private offersRepo: Repository<Offer>,
  ) {}

  async findAll(filters: { status?: string; category?: string; employerId?: string }) {
    const where: Record<string, any> = {};
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.employerId) where.employerId = filters.employerId;

    return this.jobsRepo.find({
      where,
      relations: { employer: { employerProfile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const job = await this.jobsRepo.findOne({
      where: { id },
      relations: { employer: { employerProfile: true } },
    });
    if (!job) throw new NotFoundException('Job not found');

    const offers = await this.offersRepo.find({
      where: { jobId: id },
      relations: { worker: { workerProfile: true } },
      order: { createdAt: 'DESC' },
    });

    return { ...job, offers };
  }

  async create(dto: CreateJobDto, employerId: string) {
    const job = this.jobsRepo.create({
      ...dto,
      employerId,
      status: dto.status ?? 'open',
      images: dto.images ?? [],
    });
    const saved = await this.jobsRepo.save(job);

    // increment jobsPosted on employer profile
    await this.jobsRepo.query(
      `UPDATE employer_profiles SET "jobsPosted" = "jobsPosted" + 1 WHERE "userId" = $1`,
      [employerId],
    );

    return saved;
  }

  async patchStatus(id: string, dto: PatchStatusDto, requesterId: string) {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== requesterId) throw new ForbiddenException();
    await this.jobsRepo.update({ id }, { status: dto.status });
    return { ...job, status: dto.status };
  }
}
