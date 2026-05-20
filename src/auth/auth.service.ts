import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterWorkerDto } from './dto/register-worker.dto';
import { RegisterEmployerDto } from './dto/register-employer.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    const { passwordHash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async registerWorker(dto: RegisterWorkerDto) {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new ConflictException('Email ya registrado');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      role: 'worker',
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      location: dto.location,
      phone: dto.phone,
      bio: dto.bio,
      workerProfile: {
        category: dto.category,
        skills: dto.skills,
        hourlyRate: dto.hourlyRate,
      } as any,
    });
    await this.usersRepo.save(user);
    const saved = await this.usersRepo.findOne({ where: { id: user.id } });
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    const { passwordHash: _, ...safeUser } = saved!;
    return { token, user: safeUser };
  }

  async registerEmployer(dto: RegisterEmployerDto) {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new ConflictException('Email ya registrado');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      role: 'employer',
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      location: dto.location,
      phone: dto.phone,
      bio: dto.bio,
      employerProfile: {
        companyName: dto.companyName,
      } as any,
    });
    await this.usersRepo.save(user);
    const saved = await this.usersRepo.findOne({ where: { id: user.id } });
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    const { passwordHash: _, ...safeUser } = saved!;
    return { token, user: safeUser };
  }

  async getMe(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
