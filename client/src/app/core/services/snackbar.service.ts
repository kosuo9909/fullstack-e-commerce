import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public constructor(private _snackbar: MatSnackBar) {}

  public success(message: string): void {
    this._snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-success'],
    });
  }

  public error(message: string): void {
    this._snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-error'],
    });
  }
}
