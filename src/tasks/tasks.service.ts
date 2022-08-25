import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../db/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private repository: TaskRepository,
  ) {}

  async getTaskByID(id: string, user: User): Promise<Task> {
    const found = await this.repository.findOne({ where: { id, user } });
    // const found = await this.repository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Task with ID ${id} not found`);
    return found;
  }

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.repository.getTasks(filterDto, user);
  }

  create(task: CreateTaskDto, user: User): Promise<Task> {
    return this.repository.createTask(task, user);
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskByID(id, user);
    task.status = status;
    return await this.repository.save(task);
  }

  async update(id: string, taskDto: UpdateTaskDto, user: User): Promise<Task> {
    let task = await this.getTaskByID(id, user);
    task = {
      ...task,
      ...taskDto,
    };
    return await this.repository.save(task);
  }

  async delete(id: string, user: User): Promise<void> {
    const exist: DeleteResult = await this.repository.delete({ id, user });

    if (!exist.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
