import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  imports: [MatCardModule],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent {
  public error?: { message: string; details: string };

  public constructor(private _router: Router) {
    const navigation = this._router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'] as {
      message: string;
      details: string;
    };
  }
}
