// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { TasksController } from './tasks.controller';
// import { TasksService } from './tasks.service';
// import { Task } from './task.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Task])],
//   controllers: [TasksController],
//   providers: [TasksService],
// })
// export class TasksModule {}


// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
// }

// export enum TaskStatus {
//   OPEN = 'open',
//   IN_PROGRESS = 'in_progress',
//   DONE = 'done',
// }

// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
// }
