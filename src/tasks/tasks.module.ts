import { Module } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { Task } from './entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), UsersModule],
  controllers: [TaskController],
  providers: [TaskService, UserService]
})
export class TasksModule {}
