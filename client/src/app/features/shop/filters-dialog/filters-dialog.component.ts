import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ShopService } from '@edi/app/core/services/shop.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filters-dialog',
  imports: [
    MatDividerModule,
    MatListModule,
    MatButton,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss',
})
export class FiltersDialogComponent {
  public selectedBrands: string[] = this.data.selectedBrands;
  public selectedTypes: string[] = this.data.selectedTypes;

  public shopServiceBrands$ = this._shopService.getProductBrands();
  public shopServiceTypes$ = this._shopService.getProductTypes();

  public constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedBrands: string[]; selectedTypes: string[] },
    private _shopService: ShopService,
    private _dialogRef: MatDialogRef<FiltersDialogComponent>
  ) {}

  public applyFilters() {
    this._dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes,
    });
  }
}
