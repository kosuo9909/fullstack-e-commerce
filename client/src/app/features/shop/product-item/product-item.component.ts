import { Component, Input } from '@angular/core';
import { Product } from '@edi/app/shared/models';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '@edi/app/core/services/cart.service';

@Component({
  selector: 'app-product-item',
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() public product?: Product;

  public isInWishlist = false;
  public isAddingToCart = false;

  public constructor(private _cartService: CartService) {}

  public addItemToCart() {
    if (this.product && !this.isAddingToCart) {
      this.isAddingToCart = true;

      // Simulate loading state for better UX
      setTimeout(() => {
        this._cartService.addItemToCart(this.product!);
        this.isAddingToCart = false;
      }, 800);
    }
  }

  public toggleWishlist() {
    this.isInWishlist = !this.isInWishlist;
    // TODO: Implement actual wishlist service when available
    // this._wishlistService.toggleItem(this.product);
  }
}
