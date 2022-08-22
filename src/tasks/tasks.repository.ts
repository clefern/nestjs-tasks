import { User } from 'src/user/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const newTask = this.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user,
    });
    return await this.save(newTask);
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
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
    return await query.getMany();
  }
}
