import { Injectable, signal } from '@angular/core';
import { Order } from '@edi/app/shared/models/order';
import { environment } from '@edi/environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private _hubUrl = environment.hubUrl;
  private _hubConnection?: HubConnection;

  public orderSignal = signal<Order | null>(null);

  public createHubConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this._hubUrl, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    this._hubConnection
      .start()
      .catch((err) =>
        console.error('Error while starting SignalR connection: ', err)
      );

    this._hubConnection.on('OrderCompleteNotification', (order: Order) => {
      this.orderSignal.set(order);
      console.log('Order Complete Notification: ', order);
    });
  }

  public stopHubConnection() {
    if (this._hubConnection?.state === HubConnectionState.Connected) {
      this._hubConnection
        .stop()
        .catch((err) =>
          console.error('Error while stopping SignalR connection: ', err)
        );
    }
  }
}
