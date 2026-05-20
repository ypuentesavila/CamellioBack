import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employerId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column({ type: 'json' })
  budget: { min: number; max: number };

  @Column({
    type: 'enum',
    enum: ['flexible', 'this_week', 'urgent'],
    default: 'flexible',
  })
  urgency: 'flexible' | 'this_week' | 'urgent';

  @Column({
    type: 'enum',
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  })
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ default: 0 })
  offerCount: number;

  @Column({ nullable: true })
  acceptedOfferId: string;

  @Column({ type: 'simple-array', default: '' })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
