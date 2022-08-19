import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateStatusTaskDTO } from './dto/update-status-task.dto';
import { Task } from './task.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    console.log(filterDto);

    if (Object.keys(filterDto).length) {
      return this.taskService.getFilteredTasks(filterDto);
    } else {
      return this.taskService.getTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Post()
  create(@Body() task: CreateTaskDto): Task {
    return this.taskService.create(task);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateStatusTaskDTO,
  ): Task {
    return this.taskService.updateStatus(id, status);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): boolean {
    return this.taskService.delete(id);
  }
}
