import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatSelectModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatSortModule,
  MatPaginatorModule,
  MatCardModule,
  MatCheckboxModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TableTizzaComponent } from './pages/table-tizza.component';

@NgModule({
  declarations: [
    TableTizzaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    FlexLayoutModule
  ],
  exports: [
    TableTizzaComponent
  ]
})
export class TableTizzaModule { }
