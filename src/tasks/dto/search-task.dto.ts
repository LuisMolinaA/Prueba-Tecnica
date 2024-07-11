import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { TaskCompletionStatus } from '../entity/task.entity';

export class SearchTasksDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsEnum(TaskCompletionStatus)
    status?: TaskCompletionStatus;

    @IsOptional()
    @IsInt()
    daysRemaining?: number;
}
