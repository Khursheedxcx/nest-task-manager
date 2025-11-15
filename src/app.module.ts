import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',   // 👈 your Postgres username
      password: 'postgres',   // 👈 the password you set during installation
      database: 'taskmanager',
      autoLoadEntities: true, // automatically load entities
      synchronize: true,      // auto create tables (turn off in production)
    }),
    TasksModule,
  ],
})
export class AppModule {}
