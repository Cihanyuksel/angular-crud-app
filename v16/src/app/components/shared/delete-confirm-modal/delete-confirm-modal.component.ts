import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/model/user.model';

@Component({
  selector: 'app-delete-modal',
  template: `
    <app-modal [header]="header" [(visible)]="internalVisible">
      <div class="text-center">
        <!-- Loading / Deleting -->
        <div *ngIf="loading" class="mb-3">
          <span class="spinner-border spinner-border-sm text-danger" role="status"></span>
          Siliniyor...
        </div>

        <!-- Confirmation Message -->
        <p *ngIf="!loading">
          Are you sure you want to delete <strong>{{ user?.name }}</strong
          >?
        </p>

        <!-- Buttons -->
        <div *ngIf="!loading" class="mt-3 d-flex justify-content-center gap-2">
          <button label="Cancel" class="btn btn-light" (click)="onCancel()">Cancel</button>
          <button label="Delete" class="btn btn-danger" (click)="onConfirm()">Delete</button>
        </div>
      </div>
    </app-modal>
  `,
})
export class DeleteConfirmModalComponent {
  @Input() user: User | null = null;
  @Input() loading = false;
  @Input() header = 'Delete User';

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  get internalVisible() {
    return this.visible;
  }
  set internalVisible(val: boolean) {
    this.visible = val;
    this.visibleChange.emit(val);
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
    this.internalVisible = false;
  }

  onConfirm() {
    this.confirm.emit();
  }
}
