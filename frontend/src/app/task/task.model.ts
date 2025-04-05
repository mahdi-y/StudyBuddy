export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  progressId: number | null;
  completed: boolean;
}
