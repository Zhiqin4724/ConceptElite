import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Stylist } from '../../model/stylist.model';

@Component({
  selector: 'app-stylist-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './stylist-card.component.html',
  styleUrls: ['./stylist-card.component.css']
})
export class StylistCardComponent {
  @Input({ required: true }) stylist!: Stylist;
}