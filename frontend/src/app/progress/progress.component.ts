import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ProgressService } from 'src/app/progress.service';
import { Task } from 'src/app/task/task.model';
import { Progress } from 'src/app/progress/progress.model';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, ArcElement, PieController } from 'chart.js';

// Register necessary components including BarController
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, ArcElement, PieController);

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  progressList: Progress[] = [];
  filter: 'all' | 'completed' | 'overdue' = 'all'; // Default filter
  chart: any;

  constructor(
    private taskService: TaskService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    this.progressService.getAllProgress().subscribe((progressList: Progress[]) => {
      this.progressList = progressList;
      this.loadTasksForEachProgress();
    });
  }

  loadTasksForEachProgress(): void {
    let loadedCount = 0;
    this.progressList.forEach(progress => {
      this.progressService.getTasksByProgressId(progress.id).subscribe((tasks: Task[]) => {
        progress.tasks = tasks;
        loadedCount++;

        if (loadedCount === this.progressList.length) {
          this.createChart(); // Only after all progress.tasks are loaded
        }
      });
    });
  }

  getProgressStatus(progress: Progress): string {
    const percentage = progress.progressPercentage;
    if (percentage === 100) return 'Completed';
    if (percentage === 0) return 'Not Started';
    return 'In Progress';
  }

  isOverdue(task: Task): boolean {
    return !task.completed && new Date(task.dueDate) < new Date();
  }

  filteredTasks(progress: Progress): Task[] {
    if (!progress.tasks) return [];
    switch (this.filter) {
      case 'completed':
        return progress.tasks.filter(t => t.completed);
      case 'overdue':
        return progress.tasks.filter(t => !t.completed && this.isOverdue(t));
      default:
        return progress.tasks;
    }
  }

  getSortedTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }

  getEstimatedCompletion(progress: Progress): string | null {
    const dueDates = progress.tasks?.map(t => new Date(t.dueDate)).filter(d => !isNaN(d.getTime()));
    if (!dueDates || dueDates.length === 0) return null;
    const latest = new Date(Math.max(...dueDates.map(date => date.getTime())));
    return latest.toDateString();
  }

  shouldArchiveProgress(progress: Progress): boolean {
    if (progress.progressPercentage !== 100) return false;

    const completedTasks = progress.tasks?.filter(t => t.completed);
    if (!completedTasks || completedTasks.length === 0) return false;

    const latestCompletionDate = Math.max(
      ...completedTasks.map(t => new Date(t.dueDate).getTime())
    );

    const daysPassed = (Date.now() - latestCompletionDate) / (1000 * 60 * 60 * 24);
    return daysPassed > 7;
  }

  getNonArchivedProgressCount(): number {
    return this.progressList.filter(p => !this.shouldArchiveProgress(p)).length;
  }

  getVisibleTasksCount(): number {
    return this.progressList
      .filter(p => !this.shouldArchiveProgress(p))
      .reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
  }

  getVisibleCompletedTasksCount(): number {
    return this.progressList
      .filter(p => !this.shouldArchiveProgress(p))
      .reduce((sum, p) => sum + (p.tasks?.filter(t => t.completed).length || 0), 0);
  }

  createChart() {
    const progressCount = this.getNonArchivedProgressCount();
    const taskCount = this.getVisibleTasksCount();
    const completedCount = this.getVisibleCompletedTasksCount();

    this.chart = new Chart('summaryChart', {
      type: 'bar',
      data: {
        labels: ['Total Progress', 'Total Tasks', 'Completed'],
        datasets: [{
          label: 'Progress Summary',
          data: [progressCount, taskCount, completedCount],
          backgroundColor: ['#A2DFF7', '#A3E6B3', '#FFB6A6'], // Light pastel colors
          borderColor: ['#7EC8D1', '#72B78A', '#FF8A72'], // Slightly darker borders
          borderWidth: 1,
          barThickness: 200,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Progress Summary', // Your chart title
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 30
            }
          },
          legend: {
            display: false // Hide dataset label
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  applyFilter(): void {
    // This will trigger change detection if needed
  }
}
