import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('employer_profiles')
export class EmployerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (u) => u.employerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  companyName: string;

  @Column({ default: 0 })
  jobsPosted: number;

  @Column({ default: false })
  verified: boolean;
}
