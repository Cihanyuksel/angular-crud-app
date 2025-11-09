import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AppModalComponent } from '../app-modal/app-modal';
import { UserFormComponent } from '../user-form/user-form';

interface PageEvent {
  first: number;
  rows: number;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    ProgressSpinnerModule,
    AppModalComponent,
    UserFormComponent,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserList implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  // Pagination
  first: number = 0;
  rows: number = 5;

  // Modals
  addModalVisible: boolean = false;
  editModalVisible: boolean = false;

  ModalVisible: boolean = false;
  deleteModal: { visible: boolean; user: User | null } = { visible: false, user: null };
  deleteLoading: boolean = false;

  // Loading & Error
  loading: boolean = true;
  error: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  closeModal() {
    this.selectedUser = null;
    this.editModalVisible = false;
  }

  // ------------------- API & CRUD -------------------
  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUser().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  showEditUserModal(user: User): void {
    this.selectedUser = user;
    this.editModalVisible = true;
  }

  onUserUpdated(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }

    this.editModalVisible = false;
    this.selectedUser = null;
  }

  onEditCancel(): void {
    this.editModalVisible = false;
    this.selectedUser = null;
  }
  showAddUserModal(): void {
    this.addModalVisible = true;
  }

  onUserAdded(newUser?: User): void {
    if (newUser) this.users = [newUser, ...this.users];
    this.addModalVisible = false;
  }

  showDeleteModal(user: User): void {
    this.deleteModal.user = user;
    this.deleteModal.visible = true;
  }

  confirmDeleteUser(): void {
    if (!this.deleteModal.user) return;
    this.deleteLoading = true;

    this.userService.deleteUser(this.deleteModal.user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== this.deleteModal.user?.id);
        this.deleteModal.visible = false;
        this.deleteModal.user = null;
        this.deleteLoading = false;
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.deleteLoading = false;
      },
    });
  }

  viewUser(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  editUser(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  // ------------------- Pagination -------------------
  next(): void {
    this.first += this.rows;
  }

  prev(): void {
    this.first -= this.rows;
  }

  reset(): void {
    this.first = 0;
  }

  pageChange(event: PageEvent): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  get isFirstPage(): boolean {
    return this.first === 0;
  }

  get isLastPage(): boolean {
    return this.first >= this.users.length - this.rows;
  }
}
