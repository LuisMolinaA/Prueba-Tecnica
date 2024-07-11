import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { TaskCompletionStatus } from '../entity/task.entity';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskCompletionStatus)
    completionStatus?: TaskCompletionStatus;

    @IsOptional()
    @IsDateString()
    dueDate?: Date;
}
