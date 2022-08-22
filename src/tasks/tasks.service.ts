import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private repository: TaskRepository,
  ) {}

  async getTaskByID(id: string): Promise<Task> {
    const found = await this.repository.findOne(id);
    // const found = await this.repository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Task with ID ${id} not found`);
    return found;
  }

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.repository.getTasks(filterDto);
  }

  create(task: CreateTaskDto, user: User): Promise<Task> {
    return this.repository.createTask(task, user);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskByID(id);
    task.status = status;
    return await this.repository.save(task);
  }

  async update(id: string, taskDto: UpdateTaskDto): Promise<Task> {
    let task = await this.getTaskByID(id);
    task = {
      ...task,
      ...taskDto,
    };
    return await this.repository.save(task);
  }

  async delete(id: string): Promise<void> {
    const exist: DeleteResult = await this.repository.delete(id);
    console.log(exist);

    if (!exist.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
