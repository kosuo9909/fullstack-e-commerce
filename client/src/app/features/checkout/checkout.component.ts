import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '@edi/app/core/services/stripe.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ConfirmationToken,
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
} from '@stripe/stripe-js';
import { SnackbarService } from '@edi/app/core/services/snackbar.service';
import { AccountService } from '@edi/app/core/services/account.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { firstValueFrom } from 'rxjs';
import { Address } from '@edi/app/shared/models/user';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CartService } from '@edi/app/core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ShippingAddress } from '@edi/app/shared/models';
import { OrderToCreate } from '@edi/app/shared/models/order';
import { OrderService } from '@edi/app/core/services/order.service';
@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButtonModule,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private _stripeService = inject(StripeService);
  private _snackBar = inject(SnackbarService);
  private _accountService = inject(AccountService);
  private _orderService = inject(OrderService);
  private _router = inject(Router);

  public cartService = inject(CartService);
  public saveAddress = false;
  public confirmationToken?: ConfirmationToken;

  public loading = false;

  public addressElement: StripeAddressElement;
  public paymentElement: StripePaymentElement;

  public completionStatus = signal<{
    address: boolean;
    card: boolean;
    delivery: boolean;
  }>({
    address: false,
    card: false,
    delivery: false,
  });

  public async ngOnInit() {
    try {
      this.addressElement = await this._stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);

      this.paymentElement = await this._stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handleCardChange);
    } catch (error: any) {
      this._snackBar.error(error.message);
    }
  }

  public handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update((state) => {
      state.address = true;
      return state;
    });
  };

  public handleCardChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update((state) => {
      state.card = event.complete;
      return state;
    });
  };

  public handleDeliveryChange = (event: boolean) => {
    this.completionStatus.update((state) => {
      state.delivery = event;
      return state;
    });
  };

  public ngOnDestroy() {
    this._stripeService.disposeElements();
  }

  public onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  public async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();

        if (address) {
          firstValueFrom(this._accountService.updateAddress(address));
        }
      }
    }

    if (event.selectedIndex === 2) {
      await firstValueFrom(this._stripeService.createOrUpdatePaymentIntent());
    }

    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  public async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this._stripeService.confirmPayment(
          this.confirmationToken
        );

        if (result.paymentIntent?.status === 'succeeded') {
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(
            this._orderService.createOrder(order)
          );

          if (orderResult) {
            this._orderService.orderComplete = true;
            this.cartService.deleteCart();
            this.cartService.selectedDelivery.set(null);
            this._router.navigateByUrl('/checkout/success');
            stepper.reset();
          } else {
            throw new Error('Problem creating order');
          }

          this.cartService.deleteCart();
          this.cartService.selectedDelivery.set(null);
          this._router.navigateByUrl('/checkout/success');
          stepper.reset();
          return;
        } else if (result.error) {
          throw new Error(result.error.message);
        } else {
          throw new Error('Something went wrong.');
        }
      }
    } catch (error: any) {
      this._snackBar.error(error.message || 'Something went wrong');
      stepper.previous();
      return;
    } finally {
      this.loading = false;
    }
  }

  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this.cartService.cart();
    const shippingAddress =
      (await this.getAddressFromStripeAddress()) as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;

    if (!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress) {
      throw new Error('Problem creating order');
    }

    return {
      cartId: cart.id,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year,
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress,
      discount: this.cartService.totals()?.discount,
    };
  }

  private async getConfirmationToken() {
    try {
      if (
        Object.values(this.completionStatus()).every((value) => value === true)
      ) {
        const result = await this._stripeService.createConfirmationToken();
        if (result.error) {
          throw new Error(result.error.message);
        }

        this.confirmationToken = result.confirmationToken;
      }
    } catch (error: any) {
      this._snackBar.error(error.message);
    }
  }

  private async getAddressFromStripeAddress(): Promise<
    Address | ShippingAddress | null
  > {
    const result = await this.addressElement.getValue();

    const address = result.value.address;

    if (address) {
      return {
        name: result.value.name || '',
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        country: address.country,
      };
    }

    return null;
  }
}
