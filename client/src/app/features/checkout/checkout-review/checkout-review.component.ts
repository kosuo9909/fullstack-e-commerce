import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CartService } from '@edi/app/core/services/cart.service';
import { AddressPipe } from '@edi/app/shared/pipes/address.pipe';
import { PaymentCardPipe } from '@edi/app/shared/pipes/payment-card.pipe';
import { ConfirmationToken } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-review',
  imports: [CurrencyPipe, AddressPipe, PaymentCardPipe],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss',
})
export class CheckoutReviewComponent {
  @Input() confirmationToken?: ConfirmationToken;
  public cartService = inject(CartService);

  public totals = this.cartService.totals();
}
