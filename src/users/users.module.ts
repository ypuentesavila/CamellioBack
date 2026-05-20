import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { WorkerProfile } from './entities/worker-profile.entity';
import { EmployerProfile } from './entities/employer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WorkerProfile, EmployerProfile])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
