import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { WorkerProfile } from './worker-profile.entity';
import { EmployerProfile } from './employer-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['worker', 'employer'] })
  role: 'worker' | 'employer';

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  location: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => WorkerProfile, (p) => p.user, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  workerProfile: WorkerProfile | null;

  @OneToOne(() => EmployerProfile, (p) => p.user, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  employerProfile: EmployerProfile | null;
}
