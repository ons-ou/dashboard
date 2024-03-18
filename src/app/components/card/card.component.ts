import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatMenuModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input()
  color: string = "black"

  @Input()
  icon: string = ""

  @Input()
  title: string = ""

  @Input()
  value: string = ""

}
