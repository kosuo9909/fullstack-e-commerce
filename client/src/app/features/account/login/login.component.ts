import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private _fb = inject(FormBuilder);
  private _accountService = inject(AccountService);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _returnUrl = '/shop';

  public constructor() {
    const url = this._activatedRoute.snapshot.queryParams['returnUrl'];
    if (url) this._returnUrl = url;
  }

  public loginForm = this._fb.group({
    email: [''],
    password: [''],
  });

  public onSubmit() {
    this._accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this._accountService.getUserInfo().subscribe();
        this._router.navigateByUrl(this._returnUrl);
      },
    });
  }
}
