import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import {
  Cart,
  CartItem,
  DeliveryMethod,
  Product,
} from '@edi/app/shared/models';
import { environment } from '@edi/environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cart = signal<Cart | null>(null);
  public itemCount = computed(
    () => this.cart()?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  );

  public selectedDelivery = signal<DeliveryMethod | null>(null);

  public totals = computed(() => {
    const deliveryMethod = this.selectedDelivery();
    const subtotal =
      this.cart()?.items.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      ) ?? 0;
    const discount = 0;
    const shipping = deliveryMethod ? deliveryMethod.price : 0;
    const total = subtotal - discount + shipping;
    return { subtotal, discount, shipping, total };
  });

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

  public async removeItemFromCart(id: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;

    const index = cart.items.findIndex((item) => item.productId === id);
    if (index !== -1) {
      cart.items[index].quantity -= quantity;
      if (cart.items[index].quantity === 0) {
        cart.items.splice(index, 1);
      }

      if (cart.items.length === 0) {
        this.deleteCart();
      } else {
        this.setCart(cart);
      }
    }
  }

  public deleteCart() {
    return this._http
      .delete<Cart>(`${this._baseUrl}cart?id=${this.cart()?.id}`)
      .subscribe(() => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
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
