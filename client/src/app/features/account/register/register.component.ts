import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatCard, MatButton, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public validationErrors?: string[];
  private _fb = inject(FormBuilder);
  private _accountService = inject(AccountService);
  private _router = inject(Router);
  private _snack = inject(SnackbarService);

  public registerForm = this._fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public onSubmit() {
    this._accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this._snack.success('Registration successful - you can now login');
        this._router.navigateByUrl('/account/login');
      },
      error: (errors) => (this.validationErrors = errors),
    });
  }
}
