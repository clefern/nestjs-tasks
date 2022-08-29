import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Task } from 'src/db/entities/task.entity';
import { User } from 'src/db/entities/user.entity';
import { TaskStatus } from './models/task-status.enum';
import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUser: User = {
  id: 'someID',
  username: 'clefern',
  password: 'password',
  firstName: 'Cleber',
  lastName: 'Fernandes',
  tasks: [],
};

const mockTask: Task = {
  id: 'id',
  title: 'Task title',
  description: 'task description',
  status: TaskStatus.OPEN,
  user: mockUser,
};

describe('TaskService', () => {
  let service: TasksService;
  let repository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(TasksService);
    repository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls taskRepository.getTasks and return the result', async () => {
      repository.getTasks.mockResolvedValue([]);
      const result = await service.getTasks(null, mockUser);
      expect(repository.getTasks).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('calls taskRepository.getTasks with filters and return the result', async () => {
      repository.getTasks.mockResolvedValue([]);
      const result = await service.getTasks(
        { status: TaskStatus.IN_PROGRESS, search: 'search' },
        mockUser,
      );
      expect(repository.getTasks).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('GetTaskById', () => {
    it('calls repository.findOne and returns the result', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      expect(await service.getTaskByID('id', mockUser)).toEqual(mockTask);
    });

    it('calls repository.findOne and throw error', () => {
      repository.findOne.mockResolvedValue(null);
      expect(service.getTaskByID('id', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls repository.createTask and returns the result', async () => {
      repository.createTask.mockResolvedValue(mockTask);
      expect(await service.create(mockTask, mockUser)).toEqual(mockTask);
    });
  });

  describe('updateTaskStatus', () => {
    it('calls repository.updateTaskStatus and returns the result', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      const task = {
        ...mockTask,
        status: TaskStatus.DONE,
      };
      repository.save.mockResolvedValue(task);
      expect(
        await service.updateStatus('id', TaskStatus.DONE, mockUser),
      ).toEqual(task);
    });

    it('calls repository.updateTaskStatus and throw error', () => {
      repository.findOne.mockResolvedValue(null);
      expect(
        service.updateStatus('id', TaskStatus.DONE, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('calls repository.deleteTask and returns the result', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });
      expect(await service.delete('id', mockUser)).toEqual(undefined);
    });

    it('calls repository.deleteTask and throw error', () => {
      repository.delete.mockResolvedValue({ affected: 0 });
      expect(service.delete('id', mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTask', () => {
    it('calls repository.updateTask and returns the result', async () => {
      repository.findOne.mockResolvedValue(mockTask);
      const task = {
        ...mockTask,
        title: 'new title',
      };
      repository.save.mockResolvedValue(task);
      expect(await service.update('id', task, mockUser)).toEqual(task);
    });

    it('calls repository.updateTask and throw error', () => {
      repository.findOne.mockResolvedValue(null);
      expect(service.update('id', mockTask, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
