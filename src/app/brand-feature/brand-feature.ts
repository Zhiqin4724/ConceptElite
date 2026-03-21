import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
// import {logo} from '../../assets/icon/woman-hair.png';
@Component({
  selector: 'app-brand-feature',
  imports: [CommonModule, MatGridListModule],
  templateUrl: './brand-feature.html',
  styleUrl: './brand-feature.css',
})
export class BrandFeature {
  imageUrls: string[] = [
    '../../assets/product-Display/AlterEgo_logo.webp',
    '../../assets/product-Display/Amika_logo.png',
    '../../assets/product-Display/design-me_logo.png',
    '../../assets/product-Display/Kerastase_logo.png',
    '../../assets/product-Display/Moroccanoil_logo.png',
    '../../assets/product-Display/Nioxin_logo.png',
    '../../assets/product-Display/Olaplex_logo.png',
    '../../assets/product-Display/Redken_Logo.png',
  ];
}
