import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    DividerModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css'],
})
export class UserDetailComponent implements OnInit {
  user = signal<User | null>(null);
  loading = signal<boolean>(true);
  error = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(+id);
    }
  }

  loadUser(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load user details');
        this.loading.set(false);
        console.error('Error loading user:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  editUser(): void {
    console.log('Edit user:', this.user());
  }

  deleteUser(): void {
    if (this.user() && confirm(`Are you sure you want to delete ${this.user()?.name}?`)) {
      this.userService.deleteUser(this.user()!.id).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.error.set('Failed to delete user');
        },
      });
    }
  }
}
