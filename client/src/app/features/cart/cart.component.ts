import { Component, inject } from '@angular/core';
import { CartService } from '@edi/app/core/services/cart.service';
import { CartItemComponent } from './cart-item/cart-item.component';
import { OrderSummaryComponent } from '@edi/app/shared/components/order-summary/order-summary.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, OrderSummaryComponent, EmptyStateComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  public cartService = inject(CartService);
  public router = inject(Router);
}
