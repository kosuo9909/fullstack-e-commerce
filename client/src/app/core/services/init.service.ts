import { Injectable, inject } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { Cart } from '@edi/app/shared/models';
import { AccountService } from './account.service';
import { User } from '@edi/app/shared/models/user';
import { SignalrService } from './signalr.service';
@Injectable({
  providedIn: 'root',
})
export class InitService {
  private _cartService = inject(CartService);
  private _accountService = inject(AccountService);
  private _signalRService = inject(SignalrService);

  public init(): Observable<{ cart: Cart | null; user: User }> {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this._cartService.getCart(cartId) : of(null);

    return forkJoin({
      cart: cart$,
      user: this._accountService.getUserInfo().pipe(
        tap((user) => {
          if (user) {
            this._signalRService.createHubConnection();
          }
        })
      ),
    });
  }
}
