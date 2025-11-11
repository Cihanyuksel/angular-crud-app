import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG modülleri
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    DividerModule,
    TagModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    DividerModule,
    TagModule
  ],
})
export class PrimeNgModule {}
