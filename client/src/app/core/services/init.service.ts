import { Injectable, inject } from '@angular/core';
import { CartService } from './cart.service';
import { Observable, of } from 'rxjs';
import { Cart } from '@edi/app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);

  public init(): Observable<Cart | null> {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return cart$;
  }
}
