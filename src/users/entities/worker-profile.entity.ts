import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('worker_profiles')
export class WorkerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (u) => u.workerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  category: string;

  @Column('simple-array')
  skills: string[];

  @Column({ type: 'integer', default: 0 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: 0 })
  completedJobs: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'json', default: [] })
  portfolio: { id: string; imageUrl: string; caption?: string }[];
}
