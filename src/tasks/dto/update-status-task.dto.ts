import { IsEnum } from 'class-validator';
import { TaskStatus } from '../models/task-status.enum';

export class UpdateStatusTaskDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
