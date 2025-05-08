import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '@edi/app/core/services/shop.service';
import { Product } from '@edi/app/shared/models/products';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  public product: Product;
  public quantity = 0;
  private _onDestroy$ = new Subject<void>();

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _shopService: ShopService
  ) {}

  public ngOnInit(): void {
    this.loadProduct();
  }

  public ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  public loadProduct(): void {
    const id = this._activatedRoute.snapshot.params['id'];

    if (!id) {
      return;
    }

    this._shopService
      .getProduct(+id)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((product) => {
        this.product = product;
      });
  }
}
