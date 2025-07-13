import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
// import {logo} from '../../assets/icon/woman-hair.png';
@Component({
  selector: 'app-brand-feature',
  imports: [CommonModule, MatGridListModule],
  templateUrl: './brand-feature.html',
  styleUrl: './brand-feature.css'
})


export class BrandFeature {
  imageUrls: string[] = [
    '../../assets/AlterEgo_logo.webp',
    '../../assets/Amika_logo.png',
    '../../assets/design-me_logo.png',
    '../../assets/Kerastase_logo.png',
    '../../assets/Moroccanoil_logo.png',
    '../../assets/Nioxin_logo.png',
    '../../assets/Olaplex_logo.png',
    '../../assets/Redken_Logo.png'

  ];
}
