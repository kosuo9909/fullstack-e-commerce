import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ProgressBarMode,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { CartService } from '@edi/app/core/services/cart.service';
@Component({
  selector: 'app-header',
  imports: [
    MatIconModule,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatProgressBarModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public progressBarMode: ProgressBarMode = 'indeterminate';

  public constructor(
    public busyService: BusyService,
    public cartService: CartService
  ) {}
}
