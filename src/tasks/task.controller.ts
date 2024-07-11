import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpException, HttpStatus, UsePipes, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTasksDto } from './dto/search-task.dto';

@Controller('task')
export class TaskController {
        constructor(private readonly taskService: TaskService) { }
        
        @Get("/getTasks")
        async getAllTasks() {
                return await this.taskService.getAllTasks();
        }
        
        @Get('/getTask/:id')
        async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task | HttpException> {
                return await this.taskService.getTaskById(id);
        }

        @Post("/createTask")
        @UsePipes(new ValidationPipe({ transform: true }))
        async createTask(@Body() newTask: CreateTaskDto): Promise<Task | HttpException> {
                return await this.taskService.createTask(newTask);
        }

        @Put('/updateTask/:id')
        async updateTask(
                @Param('id', ParseIntPipe) id: number,
                @Body() updateTask: UpdateTaskDto,
        ): Promise<Task | HttpException> {
                return await this.taskService.updateTask(id, updateTask);
        }

        @Delete('/delete/:id')
        async deleteTask(@Param('id', ParseIntPipe) id: number) {
                return await this.taskService.deleteTask(id);
        }

        @Get("/search")
        @UsePipes(new ValidationPipe({ transform: true }))
        async searchTasks(@Query() searchTasks: SearchTasksDto): Promise<{ tasks: Task[], total: number } | HttpException> {
                return await this.taskService.searchTasks(searchTasks);
        }
}
