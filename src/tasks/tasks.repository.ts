import { Logger } from '@nestjs/common';
import { User } from 'src/db/entities/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { Task } from '../db/entities/task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('Task Repository', true);
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const newTask = this.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user,
    });
    return await this.save(newTask);
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task').where({ user });
    if (status) {
      query.andWhere('status = :status', { status });
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('title ILIKE :search OR description ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }
    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Fail to get tasks for user ${
          user.username
        } - Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
    }
  }
}
