import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  public loading = false;
  public busyRequestCount = 0;

  public busy() {
    this.busyRequestCount++;
    this.loading = true;
  }

  public idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.loading = false;
    }
  }
}
