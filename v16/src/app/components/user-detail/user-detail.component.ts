//angular
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/model/user.model';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  // --------- State / properties ---------
  user = signal<User | null>(null);

  // Loading & Error
  isLoadingUser = signal<boolean>(true);
  loadUserError = signal<string | null>(null);

  // Modals Visibility
  isEditUserModalVisible = false;
  isDeleteModalVisible = false;

  // State for Modals
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  isDeletingUser = false;

  // --------- Constructor ---------
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  // --------- Lifecycle Hooks ---------
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(+id);
    }
  }

  // --------- Data / API calls ---------
  loadUser(id: number): void {
    this.isLoadingUser.set(true);
    this.loadUserError.set(null);

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoadingUser.set(false);
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.loadUserError.set('Failed to load user details');
        this.isLoadingUser.set(false);
      },
    });
  }

  // --------- Navigation ---------
  goBack(): void {
    this.router.navigate(['/']);
  }

  // --------- Edit Modal Management ---------
  openEditUserModal(user: User): void {
    this.selectedUser = user;
    this.isEditUserModalVisible = true;
  }

  onEditCancel(): void {
    this.isEditUserModalVisible = false;
    this.selectedUser = null;
  }

  onUserUpdated(updatedUser: User): void {
    this.user.set(updatedUser);
    this.onEditCancel();
  }

  // --------- Delete Modal Management ---------
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
        this.isDeletingUser = false;
        this.closeDeleteModal();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.loadUserError.set('Failed to delete user');
        this.isDeletingUser = false;
      },
    });
  }
}
