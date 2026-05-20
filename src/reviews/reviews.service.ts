import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Job } from '../jobs/entities/job.entity';
import { WorkerProfile } from '../users/entities/worker-profile.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepo: Repository<Review>,
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
    @InjectRepository(WorkerProfile) private workerProfileRepo: Repository<WorkerProfile>,
  ) {}

  async findAll(filters: { workerId?: string; jobId?: string; authorId?: string }) {
    const where: Record<string, any> = {};
    if (filters.workerId) where.targetId = filters.workerId;
    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.authorId) where.authorId = filters.authorId;
    return this.reviewsRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateReviewDto, authorId: string) {
    const job = await this.jobsRepo.findOne({ where: { id: dto.jobId } });
    if (!job) throw new BadRequestException('Job not found');
    if (job.status !== 'completed') {
      throw new BadRequestException('Job must be completed before reviewing');
    }

    const existing = await this.reviewsRepo.findOne({
      where: { jobId: dto.jobId, authorId },
    });
    if (existing) throw new ConflictException('Ya dejaste una reseña para este trabajo');

    const review = this.reviewsRepo.create({ ...dto, authorId });
    await this.reviewsRepo.save(review);
    await this.recalculateWorkerRating(dto.targetId);
    return review;
  }

  private async recalculateWorkerRating(workerId: string) {
    const reviews = await this.reviewsRepo.find({ where: { targetId: workerId } });
    const count = reviews.length;
    const avg =
      count > 0
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
        : 0;
    await this.workerProfileRepo.update(
      { userId: workerId },
      { rating: avg, reviewCount: count },
    );
  }
}
