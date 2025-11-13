import { IsIn, IsNotEmpty } from 'class-validator';
import { IsEnum } from 'class-validator';
import { Task } from '../task.entity';


export class UpdateTaskDto {
  @IsNotEmpty()
  @IsIn(['open', 'in_progress', 'done'])
  status: string;
}


// export class UpdateTaskDto {
//   @IsEnum(TaskStatus)
//   status: TaskStatus;
//}
