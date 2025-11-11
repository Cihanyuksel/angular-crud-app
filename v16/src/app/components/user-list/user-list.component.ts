import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {} from 'primeng/button';
import { Table } from 'primeng/table';
import { User } from 'src/model/user.model';
import { UserService } from 'src/services/user.service';

interface PageEvent {
  first: number;
  rows: number;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private userService: UserService, private router: Router) {}

  isAddUserModalVisible = false;
  isEditUserModalVisible = false;
  isDeleteModalVisible = false;
  // State for Modals
  userToDelete: User | null = null;
  isDeletingUser = false;
  // Loading & Error
  isLoadingUsers = true;
  loadUsersError: string | null = null;

  // Pagination
  first = 0;
  rows = 5;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.loadUsersError = null;

    this.userService.getUser().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoadingUsers = false;
        console.log(data);
      },
      error: (err) => {
        console.error(err);
        this.loadUsersError = 'Failed to load users. Please try again.';
        this.isLoadingUsers = false;
      },
    });
  }

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

  // --------- Navigation / helper functions ---------
  viewUser(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  filterGlobal(event: Event, dt: Table) {
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
