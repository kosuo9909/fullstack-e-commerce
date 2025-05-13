import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { StripeService } from '@edi/app/core/services/stripe.service';
import { StripeAddressElement } from '@stripe/stripe-js';
import { SnackbarService } from '@edi/app/core/services/snackbar.service';
import { AccountService } from '@edi/app/core/services/account.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { firstValueFrom } from 'rxjs';
import { Address } from '@edi/app/shared/models/user';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CartService } from '@edi/app/core/services/cart.service';
@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButtonModule,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public addressElement: StripeAddressElement;
  private _stripeService = inject(StripeService);
  private _snackBar = inject(SnackbarService);
  private _accountService = inject(AccountService);
  private _cartService = inject(CartService);

  public saveAddress = false;

  public async ngOnInit() {
    try {
      this.addressElement = await this._stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
    } catch (error: any) {
      this._snackBar.error(error.message);
    }
  }

  public ngOnDestroy() {
    this._stripeService.disposeElements();
  }

  public onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  public async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddressElement();

        if (address) {
          firstValueFrom(this._accountService.updateAddress(address));
        }
      }
    }

    if (event.selectedIndex === 2) {
      await firstValueFrom(this._stripeService.createOrUpdatePaymentIntent());
    }
  }

  private async getAddressFromStripeAddressElement(): Promise<Address | null> {
    const result = await this.addressElement.getValue();

    const address = result.value.address;

    if (address) {
      return {
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
