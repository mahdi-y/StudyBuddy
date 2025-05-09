import {Component, Input, OnInit} from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ProgressService } from 'src/app/progress.service';
import { Task } from 'src/app/task/task.model';
import { Progress } from 'src/app/progress/progress.model';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, ArcElement, PieController } from 'chart.js';
import {ActivatedRoute} from "@angular/router";

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
  archivedProgressNames: string[] = [];
  archivedProgressIds: number[] = JSON.parse(localStorage.getItem('archivedProgress') || '[]');
  archivedProgressList: any[] = [];
  showArchivedModal: boolean = false;
  showChart = false;
  @Input() studyGroupId!: number | undefined;

  constructor(
    private taskService: TaskService,
    private progressService: ProgressService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.studyGroupId !== undefined) {
      console.log('Loading progress for study group:', this.studyGroupId);
      this.loadProgressByStudyGroup(this.studyGroupId);
    } else {
      console.warn('No studyGroupId provided. Progress will not be loaded.');
    }
  }


  loadProgressByStudyGroup(studyGroupId: number): void {
    console.log('Loading progresses for study group:', studyGroupId);

    this.progressService.getProgressesByStudyGroup(studyGroupId).subscribe({
      next: (progressList: Progress[]) => {
        console.log('Progresses loaded:', progressList);

        // Filter out archived progress
        this.progressList = progressList.filter(progress => !progress.archived);

        // Load tasks for each progress
        this.loadTasksForEachProgress();
      },
      error: (err) => {
        console.error('Failed to load progresses for study group:', studyGroupId, err);
      }
    });
  }



  loadProgress(): void {
    this.progressService.getAllProgress().subscribe((progressList: Progress[]) => {
      // Filter out archived progress
      this.progressList = progressList.filter(progress => !progress.archived);
      this.loadTasksForEachProgress();
    });
  }


  loadTasksForEachProgress(): void {
    let loadedCount = 0;
    this.progressList.forEach(progress => {
      this.progressService.getTasksByProgressId(progress.id).subscribe((tasks: Task[]) => {
        progress.tasks = tasks;

        // ✅ Recalculate the percentage after tasks are loaded
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        progress.progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        loadedCount++;

        if (loadedCount === this.progressList.length) {
          this.createChart(); // Only after all progress.tasks are loaded and percentages updated
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

  // progress.component.ts
  archiveProgress(id: number): void {
    // Call the backend to archive the progress
    this.progressService.archive(id).subscribe(() => {
      // If the archive operation is successful, update the local UI state
      if (!this.archivedProgressIds.includes(id)) {
        this.archivedProgressIds.push(id);
        localStorage.setItem('archivedProgress', JSON.stringify(this.archivedProgressIds));
      }
      this.updateChartData(); // Update the chart visually
    });
  }


  isArchived(progress: Progress): boolean {
    return this.archivedProgressIds.includes(progress.id);
  }
  updateChartData(): void {
    if (!this.chart) return;

    const nonArchivedProgress = this.progressList.filter(p => !this.isArchived(p));

    const labels = ['Total Progress', 'Total Tasks', 'Completed'];
    const progressCount = nonArchivedProgress.length;
    const taskCount = nonArchivedProgress.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
    const completedCount = nonArchivedProgress.reduce(
      (sum, p) => sum + (p.tasks?.filter(t => t.completed).length || 0),
      0
    );

    // Update chart data directly
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = [progressCount, taskCount, completedCount];

    this.chart.update(); // ⬅️ Refresh the chart
  }

  getNonArchivedProgressCount(): number {
    return this.progressList.filter(p => !this.isArchived(p)).length;
  }

  getVisibleTasksCount(): number {
    return this.progressList
      .filter(p => !this.isArchived(p))
      .reduce((sum, p) => sum + (p.tasks?.length ?? 0), 0);
  }

  getCompletedTasksCountForProgress(progress: Progress): number {
    if (this.isArchived(progress)) {
      return 0;
    }

    return progress.tasks?.filter(task => task.completed).length ?? 0;
  }


  getVisibleCompletedTasksCount(): number {
    return this.progressList
      .filter(p => !this.isArchived(p))
      .reduce((sum, p) => sum + (p.tasks?.filter(t => t.completed).length || 0), 0);
  }

  isTaskDueSoon(task: Task): boolean {
    if (task.completed || !task.dueDate) return false;
    const now = new Date().getTime();
    const due = new Date(task.dueDate).getTime();
    const timeDiff = due - now;
    return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000; // within 24h
  }
// Fetch archived progresses
  getArchivedProgresses(): void {
    this.progressService.getArchivedProgresses().subscribe((data) => {
      this.archivedProgressList = data;
    });
  }

  // Method to show the archived progresses modal
  showArchivedProgressesModal(): void {
    this.getArchivedProgresses(); // Fetch the archived progresses when the modal is triggered
    this.showArchivedModal = true; // Show the modal
  }

  // Close the modal
  closeModal(): void {
    this.showArchivedModal = false;
  }
  toggleChart() {
    this.showChart = !this.showChart;

    setTimeout(() => {
      if (this.showChart && !this.chart) {
        this.createChart();
      } else if (!this.showChart && this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    }, 100); // ensures the canvas exists in the DOM
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
