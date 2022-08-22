import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateStatusTaskDTO } from './dto/update-status-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskByID(id);
  }

  @Post()
  create(@Body() task: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.taskService.create(task, user);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() task: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(id, task);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateStatusTaskDTO,
  ): Promise<Task> {
    return this.taskService.updateStatus(id, status);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
