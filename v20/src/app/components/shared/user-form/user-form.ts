import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../../model/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css'],
})
export class UserFormComponent implements OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() user: User | null = null;
  @Output() userSaved = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.form.patchValue(this.user);
    }
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const data = this.form.value;

    if (this.mode === 'add') {
      this.userService.addUser(data).subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => this.handleError(err),
      });
    } else if (this.mode === 'edit' && this.user) {
      this.userService.updateUser(this.user.id, { ...this.user, ...data }).subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => this.handleError(err),
      });
    }
  }

  handleSuccess(res: User) {
    this.isSubmitting = false;
    this.userSaved.emit(res);
    this.form.reset();
  }

  handleError(err: any) {
    console.error(err);
    this.isSubmitting = false;
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
  }
}
