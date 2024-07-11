import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { HttpException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { SearchTasksDto } from './dto/search-task.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private userService: UserService
    ) { }

    async getAllTasks() {
        const [tasks, total] = await this.taskRepository.findAndCount();
        return { 
            tasks, total
         };
    }

    async getTaskById(id: number) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new HttpException("tarea no encontrada", HttpStatus.NOT_FOUND);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto) {
        try {
            const { userId, ...taskData } = createTaskDto;

            const user = await this.userService.getUser(parseInt(userId));

            if (user instanceof HttpException) {
                throw user;
            }

            const newTask = this.taskRepository.create({
                ...taskData,
                createdBy: user,
            });

            return await this.taskRepository.save(newTask);
        } catch (error) {
            throw new HttpException("Error al crear tarea", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new HttpException("tarea a actualizar no encontrada", HttpStatus.NOT_FOUND);
        }
        this.taskRepository.merge(task, updateTaskDto);
        return await this.taskRepository.save(task);
    }

    async deleteTask(id: number) {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new HttpException("", HttpStatus.NOT_FOUND);
        }
        return result
    }

    async searchTasks(searchTasksDto: SearchTasksDto): Promise<{ tasks: Task[], total: number }> {
        const { keyword, status, daysRemaining } = searchTasksDto;

        const query = this.taskRepository.createQueryBuilder('task');

        if (keyword) {
            query.andWhere('task.title LIKE :keyword OR task.description LIKE :keyword', { keyword: `%${keyword}%` });
        }

        if (status) {
            query.andWhere('task.completionStatus = :status', { status });
        }

        if (daysRemaining !== undefined) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + daysRemaining);
            query.andWhere('task.dueDate <= :targetDate', { targetDate });
        }

        const [tasks, total] = await query.getManyAndCount();

        return { tasks, total };
    }
}
