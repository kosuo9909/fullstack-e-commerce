import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order } from '../../../shared/models/order';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCardModule,
    MatButton,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe,
    RouterLink,
  ],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss',
})
export class OrderDetailedComponent implements OnInit {
  private _orderService = inject(OrderService);
  private _activatedRoute = inject(ActivatedRoute);

  public order?: Order;

  public ngOnInit(): void {
    this.loadOrder();
  }

  public loadOrder(): void {
    const orderId = this._activatedRoute.snapshot.paramMap.get('id');
    if (!orderId) return;
    this._orderService.getOrderDetailed(+orderId).subscribe({
      next: (order) => (this.order = order),
      error: (err) => console.error('Error loading order:', err),
    });
  }
}
