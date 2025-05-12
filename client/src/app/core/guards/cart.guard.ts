import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { inject } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
export const cartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const snack = inject(SnackbarService);
  const router = inject(Router);

  if (cartService.itemCount() > 0) {
    return true;
  }

  router.navigate(['/cart']);
  snack.error('Your cart is empty');
  return false;
};
