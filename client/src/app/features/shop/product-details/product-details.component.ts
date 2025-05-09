import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '@edi/app/core/services/shop.service';
import { Product } from '@edi/app/shared/models/products';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CartService } from '@edi/app/core/services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  public product: Product;
  public quantity = 1;
  public quantityInCart = 0;
  private _onDestroy$ = new Subject<void>();
  private _cartService = inject(CartService);

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _shopService: ShopService
  ) {}

  public ngOnInit(): void {
    this.loadProduct();
  }

  public ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public loadProduct(): void {
    const id = this._activatedRoute.snapshot.params['id'];

    if (!id) {
      return;
    }

    this._shopService
      .getProduct(+id)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((product) => {
        this.product = product;
        this.updateQuantityInCart();
      });
  }

  public updateQuantityInCart() {
    this.quantityInCart =
      this._cartService
        .cart()
        ?.items.find((item) => item.productId === this.product.id)?.quantity ??
      0;

    this.quantity = this.quantityInCart || 1;
  }

  public getButtonText() {
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart';
  }

  public updateCart() {
    if (!this.product) {
      return;
    }

    if (this.quantityInCart === this.quantity) {
      return;
    }

    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this._cartService.addItemToCart(this.product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this._cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }
}
