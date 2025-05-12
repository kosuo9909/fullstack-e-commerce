import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { BusyService } from '../../../core/services/busy.service';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIcon, MatButton],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  public busyService = inject(BusyService);
  public message = input.required<string>();
  public icon = input.required<string>();
  public actionText = input.required<string>();
  public action = output<void>();

  public onAction() {
    this.action.emit();
  }
}
