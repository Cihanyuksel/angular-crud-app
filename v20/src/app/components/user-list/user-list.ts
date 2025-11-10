//angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
//ui
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
//project files
import { AppModalComponent } from '../shared/app-modal/app-modal';
import { UserFormComponent } from '../shared/user-form/user-form';
import { DeleteModalComponent } from '../shared/delete-confirm-modal/delete-confirm-modal';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

interface PageEvent {
  first: number;
  rows: number;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    ProgressSpinnerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    AppModalComponent,
    UserFormComponent,
    DeleteModalComponent,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserList implements OnInit {
  // --------- State / properties ---------
  users: User[] = [];
  selectedUser: User | null = null;

  // Pagination
  first = 0;
  rows = 5;

  // Modals Visibility
  isAddUserModalVisible = false;
  isEditUserModalVisible = false;
  isDeleteModalVisible = false;

  // State for Modals
  userToDelete: User | null = null;
  isDeletingUser = false;

  // Loading & Error
  isLoadingUsers = true;
  loadUsersError: string | null = null;

  // --------- Constructor ---------
  constructor(private userService: UserService, private router: Router) {}

  // --------- Lifecycle Hooks ---------
  ngOnInit(): void {
    this.loadUsers();
  }

  // --------- Modals Management ---------
  // ADD USER
  openAddUserModal(): void {
    this.isAddUserModalVisible = true;
  }

  onUserAdded(newUser?: User): void {
    if (newUser) {
      this.users = [newUser, ...this.users];
    }
    this.isAddUserModalVisible = false;
  }

  // EDIT USER
  openEditUserModal(user: User): void {
    this.selectedUser = user;
    this.isEditUserModalVisible = true;
  }

  onUserUpdated(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
    this.onEditCancel();
  }

  onEditCancel(): void {
    this.isEditUserModalVisible = false;
    this.selectedUser = null;
  }

  // DELETE USER
  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.isDeleteModalVisible = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalVisible = false;
    this.userToDelete = null;
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.isDeletingUser = true;
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== this.userToDelete?.id);
        this.isDeletingUser = false;
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.isDeletingUser = false;
      },
    });
  }

  // --------- API / CRUD ---------
  loadUsers(): void {
    this.isLoadingUsers = true;
    this.loadUsersError = null;

    this.userService.getUser().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoadingUsers = false;
      },
      error: (err) => {
        console.error(err);
        this.loadUsersError = 'Failed to load users. Please try again.';
        this.isLoadingUsers = false;
      },
    });
  }

  // --------- Navigation / helper functions ---------
  viewUser(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  filterGlobal(event: Event, dt: any) {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }
  
  // --------- Pagination ---------
  next(): void {
    this.first += this.rows;
  }

  prev(): void {
    this.first -= this.rows;
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