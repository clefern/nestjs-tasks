import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/db/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateStatusTaskDTO } from './dto/update-status-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '../db/entities/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('Task Controller', true);
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User: ${user.username} retrieving all tasks!`);
    this.logger.verbose(`Filters: ${JSON.stringify(filterDto)}`);
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskByID(id, user);
  }

  @Post()
  create(@Body() task: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.taskService.create(task, user);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.update(id, task, user);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateStatusTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateStatus(id, status, user);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.delete(id, user);
  }
}
