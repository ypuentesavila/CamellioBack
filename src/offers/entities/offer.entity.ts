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

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobId: string;

  @Column()
  workerId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'workerId' })
  worker: User;

  @Column()
  employerId: string;

  @Column({ type: 'integer' })
  proposedPrice: number;

  @Column()
  estimatedDuration: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'negotiating', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  })
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected' | 'withdrawn';

  @Column({ nullable: true, type: 'integer' })
  counterOfferPrice: number;

  @Column({ nullable: true, type: 'text' })
  counterOfferNote: string;

  @Column({ default: 0 })
  negotiationRound: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
