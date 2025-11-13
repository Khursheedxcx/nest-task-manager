import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createDto: CreateTaskDto) {
    return this.tasksService.createTask(createDto.title,  createDto.description);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateDto.status);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
