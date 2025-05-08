import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  imports: [MatButtonModule],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss',
})

// CONSIDER USING A SERVICE FOR THIS
export class TestErrorComponent {
  public baseUrl = 'https://localhost:5001/api/';
  public validationErrors?: string[];

  public constructor(private _http: HttpClient) {}

  public get404Error() {
    this._http.get(this.baseUrl + 'buggy/notfound').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  public get400Error() {
    this._http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  public get401Error() {
    this._http.get(this.baseUrl + 'buggy/unauthorized').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  public get500Error() {
    this._http.get(this.baseUrl + 'buggy/internalerror').subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  public get400ValidationError() {
    this._http.post(this.baseUrl + 'buggy/validationerror', {}).subscribe({
      next: (response) => console.log(response),
      error: (error) => {
        this.validationErrors = error;
      },
    });
  }
}
