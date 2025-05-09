import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Cart, CartItem, Product } from '@edi/app/shared/models';
import { environment } from '@edi/environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cart = signal<Cart | null>(null);
  private _baseUrl = environment.apiUrl;

  public constructor(private _http: HttpClient) {}

  public getCart(id: string) {
    return this._http.get<Cart>(`${this._baseUrl}cart?id=${id}`).pipe(
      map((cart) => {
        this.cart.set(cart);
        return cart;
      })
    );
  }

  public setCart(cart: Cart) {
    return this._http
      .post<Cart>(`${this._baseUrl}cart`, cart)
      .subscribe((cart) => {
        this.cart.set(cart);
      });
  }

  public addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();

    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }

    cart.items = this.addOrUpdateItem(cart.items, item, quantity);

    this.setCart(cart);
  }

  public removeItemFromCart(id: number) {
    return this._http
      .delete<Cart>(`${this._baseUrl}cart/${id}`)
      .subscribe((cart) => {
        this.cart.set(cart);
      });
  }

  public removeAllItemsFromCart() {
    return this._http.delete<Cart>(`${this._baseUrl}cart`).subscribe((cart) => {
      this.cart.set(cart);
    });
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  private isProduct(item: CartItem | Product): item is Product {
    return 'id' in item;
  }

  private mapProductToCartItem(product: Product): CartItem {
    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 0,
      pictureUrl: product.pictureUrl,
      brand: product.brand,
      type: product.type,
    };
  }

  private addOrUpdateItem(
    items: CartItem[],
    itemToAdd: CartItem,
    quantity: number
  ): CartItem[] {
    const index = items.findIndex((i) => i.productId === itemToAdd.productId);

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }
}
