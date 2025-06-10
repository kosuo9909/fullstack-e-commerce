import { Injectable, inject } from '@angular/core';
import {
  ConfirmationToken,
  Stripe,
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeElements,
  StripePaymentElement,
  StripePaymentElementOptions,
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
  private _paymentElement?: StripePaymentElement;

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
          // Add locale for better international support
          locale: 'bg',
        });
      } else {
        throw new Error('Stripe instance not found');
      }
    }
    return this._elements;
  }

  public async createPaymentElement() {
    if (!this._paymentElement) {
      const elements = await this.initializeElements();

      if (elements) {
        // For testing - this will show more payment options in development
        const options: StripePaymentElementOptions = {
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
          // Explicitly list all payment methods you want to show
          paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
          business: { name: 'Your Store Name' },
          fields: {
            billingDetails: 'auto',
          },
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
        };

        this._paymentElement = elements.create('payment', options);
      } else {
        throw new Error('Elements not initialized');
      }
    }

    return this._paymentElement;
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

  public async createConfirmationToken() {
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();

    const result = await elements.submit();

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (stripe) {
      return await stripe.createConfirmationToken({ elements });
    } else {
      throw new Error('Stripe instance not found');
    }
  }

  public async confirmPayment(confirmationToken: ConfirmationToken) {
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = await elements.submit();

    if (result.error) {
      throw new Error(result.error.message);
    }

    const clientSecret = this._cartService.cart()?.clientSecret;

    if (stripe && clientSecret) {
      return await stripe.confirmPayment({
        redirect: 'if_required',
        clientSecret,
        confirmParams: {
          confirmation_token: confirmationToken.id,
        },
      });
    } else {
      throw new Error('Stripe instance or client secret not found');
    }
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
    this._paymentElement = undefined;
  }
}
