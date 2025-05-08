import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, Product } from '@edi/app/shared/models';
import { ShopParams } from '@edi/app/shared/models/shopParams';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  switchMap,
  shareReplay,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private _baseUrl = 'https://localhost:5001/api';
  private _pageSize = 20;

  private refreshTrigger = new BehaviorSubject<void>(undefined);

  private _types$: Observable<string[]> = this.refreshTrigger.pipe(
    switchMap(() =>
      this._httpClient.get<string[]>(`${this._baseUrl}/products/types`)
    ),
    shareReplay(1)
  );

  private _brands$: Observable<string[]> = this.refreshTrigger.pipe(
    switchMap(() =>
      this._httpClient.get<string[]>(`${this._baseUrl}/products/brands`)
    ),
    shareReplay(1)
  );

  public constructor(private _httpClient: HttpClient) {}

  public getProducts(shopParams: ShopParams): Observable<Pagination<Product>> {
    let params = new HttpParams();
    params = params.set('page', shopParams.pageNumber.toString());
    params = params.set('pageSize', shopParams.pageSize.toString());
    params = params.set('pageIndex', shopParams.pageNumber.toString());

    if (shopParams.brands && shopParams.brands.length > 0) {
      params = params.set('brands', shopParams.brands.join(','));
    }

    if (shopParams.types && shopParams.types.length > 0) {
      params = params.set('types', shopParams.types.join(','));
    }

    if (shopParams.sort) {
      params = params.set('sort', shopParams.sort);
    }

    if (shopParams.search) {
      params = params.set('search', shopParams.search);
    }

    return this._httpClient.get<Pagination<Product>>(
      `${this._baseUrl}/products`,
      { params }
    );
  }

  public getProduct(id: number): Observable<Product> {
    return this._httpClient.get<Product>(`${this._baseUrl}/products/${id}`);
  }

  public getProductTypes(): Observable<string[]> {
    return this._types$;
  }

  public getProductBrands(): Observable<string[]> {
    return this._brands$;
  }

  public refreshBrandAndType(): void {
    this.refreshTrigger.next();
  }
}
