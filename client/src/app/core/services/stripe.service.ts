import { Injectable, inject } from '@angular/core';
import {
  Stripe,
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeElements,
} from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '@edi/app/shared/models';
import { firstValueFrom, map } from 'rxjs';
import { AccountService } from './account.service';
@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private _baseUrl = environment.apiUrl;
  private _cartService = inject(CartService);
  private _accountService = inject(AccountService);
  private _http = inject(HttpClient);
  private _stripePromise: Promise<Stripe | null>;
  private _elements?: StripeElements;
  private _addressElement?: StripeAddressElement;

  public constructor() {
    this._stripePromise = loadStripe(environment.stripePublicKey);
  }

  public getStripeInstance(): Promise<Stripe | null> {
    return this._stripePromise;
  }

  public async initializeElements() {
    if (!this._elements) {
      const stripe = await this.getStripeInstance();

      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this._elements = stripe.elements({
          clientSecret: cart.clientSecret,
          appearance: {
            labels: 'floating',
          },
        });
      } else {
        throw new Error('Stripe instance not found');
      }
    }
    return this._elements;
  }

  public async createAddressElement() {
    if (!this._addressElement) {
      const elements = await this.initializeElements();

      if (elements) {
        const user = this._accountService.currentUser();

        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};

        if (user) {
          console.log(
            'user first and last name',
            user.firstName,
            user.lastName,
            user
          );

          defaultValues = {
            name: user.firstName + ' ' + user.lastName,
          };
        }

        if (user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            postal_code: user.address.postalCode,
          };
        }

        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues,
        };

        this._addressElement = elements.create('address', options);
      } else {
        throw new Error('Elements not initialized');
      }
    }

    return this._addressElement;
  }

  public createOrUpdatePaymentIntent() {
    const cart = this._cartService.cart();

    if (!cart) {
      throw new Error('Cart is not available');
    }

    // This returns an updated cart with the payment intent id
    return this._http
      .post<Cart>(`${this._baseUrl}payments/${cart.id}`, {})
      .pipe(
        map((cart) => {
          this._cartService.setCart(cart);
          return cart;
        })
      );
  }

  public disposeElements() {
    this._elements = undefined;
    this._addressElement = undefined;
  }
}
