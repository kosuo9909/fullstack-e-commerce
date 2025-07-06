import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order, OrderToCreate } from '../../shared/models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _http = inject(HttpClient);

  public baseUrl = environment.apiUrl;
  public orderComplete = false;

  public createOrder(orderToCreate: OrderToCreate) {
    return this._http.post<Order>(this.baseUrl + 'orders', orderToCreate);
  }

  public getOrdersForUser() {
    return this._http.get<Order[]>(this.baseUrl + 'orders');
  }

  public getOrderDetailed(id: number) {
    return this._http.get<Order>(this.baseUrl + 'orders/' + id);
  }
}
