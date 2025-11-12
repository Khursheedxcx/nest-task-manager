import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  getTaskById(id: string): Promise<Task> {
    return this.tasksRepository.findOneBy({ id });
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({ ...dto, status: 'open' });
    return this.tasksRepository.save(task);
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    task.status = dto.status;
    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Task with id ${id} not found`);
  }
}
