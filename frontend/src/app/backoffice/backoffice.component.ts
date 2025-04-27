import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.scss']
})
export class BackofficeComponent implements OnInit {
  users: any[] = [];
  newUser: any = {};
  statistics: { totalAccounts: number; agePercentages: { [key: string]: number } } | null = null;
  getNonAdminUsers() {
    return this.users.filter(user => user.role !== 'ADMIN');
  }
  
  // Chart configuration
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED']
    }]
  };
  public pieChartType: 'pie' = 'pie';
  public pieChartLegend = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStatistics();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({ ...user, editing: false, original: { ...user } }));
        console.log('Loaded users:', this.users);
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  loadStatistics(): void {
    this.userService.getUserStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        console.log('Fetched statistics:', stats);
        if (stats.agePercentages) {
          this.pieChartData.labels = Object.keys(stats.agePercentages);
          this.pieChartData.datasets[0].data = Object.values(stats.agePercentages);
        }
      },
      error: (err) => {
        console.error('Error fetching statistics:', err);
      }
    });
  }

  editUser(user: any): void {
    user.editing = true;
  }

  cancelEdit(user: any): void {
    Object.assign(user, user.original);
    user.editing = false;
  }

  onUpdateUser(user: any): void {
    this.userService.updateUser(user.id, user).subscribe({
      next: () => {
        user.editing = false;
        user.original = { ...user };
        console.log('User updated:', user);
        this.loadStatistics(); // Refresh statistics
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  onDeleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.loadStatistics(); // Refresh statistics
          console.log('User deleted:', id);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }
}