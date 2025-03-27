import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, finalize, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Pagination, Product } from './shared/models';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private _baseUrl = 'https://localhost:5001/api';
  private _onDestroy: Subject<void> = new Subject<void>();

  public products: Product[] = [];

  public constructor(private _http: HttpClient) {}

  public ngOnInit(): void {
    this._http
      .get<Pagination<Product>>(`${this._baseUrl}/products`)
      .pipe(
        tap((response) => console.log('Data:', response)),
        catchError((error) => {
          console.error('Error:', error);
          return of({ data: [], total: 0, page: 1, pageSize: 0 });
        }),
        finalize(() => console.log('Request completed'))
      )
      .subscribe((response) => (this.products = response.data));
  }

  public ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
