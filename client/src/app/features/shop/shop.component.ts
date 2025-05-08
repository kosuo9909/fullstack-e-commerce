import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ShopService } from '@edi/app/core/services/shop.service';
import { Pagination, Product } from '@edi/app/shared/models';
import { Subject, tap, catchError, of, finalize } from 'rxjs';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '@edi/app/shared/models/shopParams';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-shop',
  imports: [
    MatCardModule,
    ProductItemComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatListModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private _onDestroy: Subject<void> = new Subject<void>();

  public products?: Pagination<Product>;

  public sortOptions: { name: string; value: string }[] = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  public shopParams = new ShopParams();

  public constructor(
    private _shopService: ShopService,
    private _matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.getProducts();
  }

  public ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public getProducts(): void {
    this._shopService
      .getProducts(this.shopParams)
      .pipe(
        tap((response) => console.log('Data:', response)),
        catchError((error) => {
          console.error('Error:', error);
          return of({ data: [], count: 0, pageIndex: 0, pageSize: 0 });
        }),
        finalize(() => console.log('Request completed'))
      )
      .subscribe((response) => (this.products = response));
  }

  public openFiltersDialog(): void {
    const dialogRef = this._matDialog.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
        sort: this.shopParams.sort,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.shopParams.brands = result.selectedBrands;
        this.shopParams.types = result.selectedTypes;
        this.shopParams.pageNumber = 1;
        this.getProducts();
      }
    });
  }

  public onSearchChange(): void {
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  public onSortChange(event: MatSelectionListChange): void {
    const selectedSort = event.options[0].value;
    if (selectedSort) {
      this.shopParams.sort = selectedSort;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  public handlePageEvent(event: PageEvent): void {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }
}
