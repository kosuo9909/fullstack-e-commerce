import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../../shared/models/cart';
import { RouterLink } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  public item = input.required<CartItem>();
  public cartService = inject(CartService);

  public incrementQuantity() {
    this.cartService.addItemToCart(this.item());
  }

  public decrementQuantity() {
    this.cartService.removeItemFromCart(this.item().productId);
  }

  public removeItemFromCart() {
    this.cartService.removeItemFromCart(
      this.item().productId,
      this.item().quantity
    );
  }
}
