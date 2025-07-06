import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit, OnDestroy {
  private _orderService = inject(OrderService);
  private _destroy$ = new Subject<void>();
  public orders: Order[] = [];

  public ngOnInit(): void {
    this._orderService
      .getOrdersForUser()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (orders) => (this.orders = orders),
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
