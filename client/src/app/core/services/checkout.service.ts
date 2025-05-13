import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethod } from '@edi/app/shared/models';
import { environment } from '@edi/environments/environment';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  public deliveryMethods: DeliveryMethod[] = [];
  private _baseUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  public getDeliveryMethods() {
    if (this.deliveryMethods.length > 0) {
      return of(this.deliveryMethods);
    }

    return this._http
      .get<DeliveryMethod[]>(`${this._baseUrl}payments/delivery-methods`)
      .pipe(
        tap(
          (methods) =>
            (this.deliveryMethods = methods.sort((a, b) => b.price - a.price))
        )
      );
  }
}
