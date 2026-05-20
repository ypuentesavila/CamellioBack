import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WorkerProfile } from './entities/worker-profile.entity';
import { EmployerProfile } from './entities/employer-profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(WorkerProfile) private workerProfileRepo: Repository<WorkerProfile>,
    @InjectRepository(EmployerProfile) private employerProfileRepo: Repository<EmployerProfile>,
  ) {}

  async findWorkers(filters: { category?: string; q?: string; location?: string }) {
    const qb = this.usersRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.workerProfile', 'wp')
      .where('u.role = :role', { role: 'worker' });

    if (filters.category) {
      qb.andWhere('wp.category = :cat', { cat: filters.category });
    }
    if (filters.q) {
      qb.andWhere(
        '(LOWER(u.name) LIKE :q OR LOWER(u.location) LIKE :q OR LOWER(wp.category) LIKE :q)',
        { q: `%${filters.q.toLowerCase()}%` },
      );
    }
    if (filters.location) {
      qb.andWhere('LOWER(u.location) LIKE :loc', {
        loc: `%${filters.location.toLowerCase()}%`,
      });
    }

    const workers = await qb.orderBy('wp.rating', 'DESC').getMany();
    return workers.map(({ passwordHash, ...u }) => u);
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, requesterId: string, dto: UpdateUserDto) {
    if (id !== requesterId) throw new ForbiddenException();
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const { category, skills, hourlyRate, available, companyName, ...userFields } = dto;

    Object.assign(user, userFields);
    await this.usersRepo.save(user);

    if (user.role === 'worker' && (category || skills || hourlyRate !== undefined || available !== undefined)) {
      await this.workerProfileRepo.update(
        { userId: id },
        { ...(category && { category }), ...(skills && { skills }), ...(hourlyRate !== undefined && { hourlyRate }), ...(available !== undefined && { available }) },
      );
    }

    if (user.role === 'employer' && companyName !== undefined) {
      await this.employerProfileRepo.update({ userId: id }, { companyName });
    }

    return this.findOne(id);
  }
}
