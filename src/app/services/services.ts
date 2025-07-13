import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import {logo} from '../../assets/icon/woman-hair.png';
@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css'
})


export class Services {
services = [
    { logo: '../../assets/icon/haircut.png', title: 'Haircut' },
    { logo: '../../assets/icon/hair-comb.png', title: 'Styling' },
    { logo: '../../assets/icon/color-palette.png', title: 'Coloration' },
    { logo: '../../assets/icon/massage.png', title: 'Treatment' }
  ];
  details = [
    { name: 'Men\'s Haircut', price: '30' },
    { name: 'Women\'s Haircut', price: '50' },
    { name: 'Beard Trim', price: '15' },
    { name: 'Shampoo & Condition', price: '10' },
    { name: 'Full Color', price: '80' },
    { name: 'Highlights', price: '120' },
    { name: 'Deep Conditioning Treatment', price: '45' },
    { name: 'Scalp Massage', price: '25' }
  ];
}
