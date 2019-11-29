import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { startWith, filter, debounceTime, switchMap, catchError, map, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, merge, of } from 'rxjs';

import { TableTizzaService } from '../table-tizza.service';

@Component({
  selector: 'app-table-tizza',
  templateUrl: './table-tizza.component.html',
  styleUrls: ['./table-tizza.component.scss']
})
export class TableTizzaComponent implements OnInit, AfterViewInit, OnDestroy {

  searchField = new FormControl();
  sub = new Subscription();

  // data = CONST.DATABASE;
  data: any[];
  sortedData = [];
  query = {};

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private tableTizzaService: TableTizzaService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.list();
    this.paginatorIntl();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  list() {

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });
    this.searchField.valueChanges.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    this.sub.add(merge(this.sort.sortChange, this.paginator.page, this.searchField.valueChanges)
      .pipe(
        startWith({}),
        filter(value => (typeof value === 'string' && value.length > 1) || typeof value !== 'string' || value === ''),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(() => {
          this.isLoadingResults = true;
          let search = '';

          if (this.searchField.value) {
            search = this.searchField.value.trim().toLowerCase();
          }

          return this.tableTizzaService.listOS({
            query: this.query,
            sort: this.sort.active,
            order: this.sort.direction,
            page: this.paginator.pageIndex,
            limit: this.paginator.pageSize,
            search
          });
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;
          this.selection.clear();
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          this.selection.clear();
          return of([]);
        })
      ).subscribe(data => {
        this.data = data;
      }));
  }

  funcButton() {
    console.log(this.selection.selected);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.data.forEach(row => this.selection.select(row));
  }

  paginatorIntl() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.nextPageLabel = 'Próximo';
    this.paginator._intl.previousPageLabel = 'Anterior';
  }
}
