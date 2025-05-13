import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Address, User } from '@edi/app/shared/models/user';
import { environment } from '@edi/environments/environment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  public baseUrl = environment.apiUrl;
  public currentUser = signal<User | null>(null);

  private _http = inject(HttpClient);

  public login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', 'true');

    return this._http
      .post<User>(`${this.baseUrl}login`, values, {
        params,
      })
      .pipe(
        map((user) => {
          console.log('during login received user', user);

          this.currentUser.set(user);
          return user;
        })
      );
  }

  public register(values: any) {
    console.log('register', values);

    return this._http.post(`${this.baseUrl}account/register`, values);
  }

  public getUserInfo() {
    return this._http
      .get<User>(`${this.baseUrl}account/user-info`)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  public logout() {
    return this._http
      .post(`${this.baseUrl}account/logout`, {})
      .pipe(tap(() => this.currentUser.set(null)));
  }

  public updateAddress(address: Address) {
    return this._http.post(`${this.baseUrl}account/address`, address).pipe(
      tap(() => {
        this.currentUser.update((user) => {
          if (user) {
            user.address = address;
          }

          return user;
        });
      })
    );
  }

  public getAuthState() {
    return this._http.get<{ isAuthenticated: boolean }>(
      `${this.baseUrl}account/auth-state`
    );
  }
}
