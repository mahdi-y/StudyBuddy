export interface Task {
  id: number; // Automatically generated ID by Spring Boot
  title: string;
  description: string;
  dueDate: string; // String representation of LocalDateTime (ISO 8601)
  createdAt?: string; // Optional, as it's set by Spring Boot (not required to be sent)
  progressId: number | null; // ID of the progress entity, can be null
  completed: boolean; // True or false depending on whether the task is completed
}
