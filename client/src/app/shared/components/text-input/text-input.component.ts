import { Component, Input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatError, MatLabel],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() public label = '';
  @Input() public type = 'text';

  public constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  public writeValue(obj: any): void {}

  public registerOnChange(fn: any): void {}

  public registerOnTouched(fn: any): void {}

  public get control() {
    return this.controlDir.control as FormControl;
  }
}
