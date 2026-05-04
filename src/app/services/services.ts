import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

interface PriceRow {
  label: string;
  price: string;
}

interface ServiceCard {
  logo: string;
  title: string;
  menuTitle: string;
  rows: PriceRow[];
}

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  private readonly theme = inject(ThemeService);

  private readonly coiffureServices: ServiceCard[] = [
    {
      logo: '../../assets/icon/haircut.png',
      title: 'Haircut',
      menuTitle: 'Haircut',
      rows: [
        { label: 'Women', price: '36.00$' },
        { label: 'Men', price: '27.00$' },
        { label: 'Boys (0 - 11 years old)', price: '23.00$' },
        { label: 'Girls (0 - 11 years old)', price: '26.00$' },
      ],
    },
    {
      logo: '../../assets/icon/hair-comb.png',
      title: 'Styling',
      menuTitle: 'Styling',
      rows: [
        { label: 'Blow-dry', price: '40.00$' },
        { label: 'Updo', price: '75.00$' },
        { label: 'Bridal styling', price: '120.00$' },
        { label: 'Hair extensions setup', price: '95.00$' },
      ],
    },
    {
      logo: '../../assets/icon/color-palette.png',
      title: 'Coloration',
      menuTitle: 'Coloration',
      rows: [
        { label: 'Single process', price: '85.00$' },
        { label: 'Highlights', price: '130.00$' },
        { label: 'Balayage', price: '180.00$' },
        { label: 'Color correction', price: '210.00$' },
      ],
    },
    {
      logo: '../../assets/icon/massage.png',
      title: 'Treatment',
      menuTitle: 'Treatment',
      rows: [
        { label: 'Deep conditioning', price: '45.00$' },
        { label: 'Keratin smoothing', price: '160.00$' },
        { label: 'Scalp massage', price: '35.00$' },
        { label: 'Olaplex repair', price: '55.00$' },
      ],
    },
  ];

  private readonly barberServices: ServiceCard[] = [
    {
      logo: '../../assets/icon/haircut.png',
      title: 'Barber Cut',
      menuTitle: 'Barber Cut',
      rows: [
        { label: 'Classic Cut', price: '30.00$' },
        { label: 'Skin Fade', price: '35.00$' },
        { label: 'Beard Trim', price: '15.00$' },
        { label: 'Hot Towel Shave', price: '25.00$' },
      ],
    },
  ];

  readonly services = computed<ServiceCard[]>(() =>
    this.theme.mode() === 'barber' ? this.barberServices : this.coiffureServices,
  );

  readonly isSingleService = computed(() => this.services().length === 1);
}
