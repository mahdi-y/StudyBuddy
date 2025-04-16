import { Task } from '../task/task.model';  // Adjust the path as necessary

export interface Progress {
  id: number;
  progressPercentage: number;  // Can be a decimal value like 75.5
  totalTasks: number;
  totalCompletedTasks: number;
  name : string;
  tasks?: Task[]; // Adding tasks as an optional property
}
