import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.interface';

export class UpdateStatusTaskDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
