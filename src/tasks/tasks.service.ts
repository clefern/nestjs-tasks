import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.interface';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getFilteredTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getTasks();
    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task: Task) =>
          task.description.includes(search) || task.title.includes(search),
      );
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task: Task) => task.id === id);
  }

  create(task: CreateTaskDto): Task {
    const newTask: Task = {
      ...task,
      id: uuid(),
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  delete(id: string): boolean {
    const exist = this.tasks.find((task: Task) => task.id === id);
    this.tasks = this.tasks.filter((task: Task) => task.id !== id);
    return !!exist;
  }
}