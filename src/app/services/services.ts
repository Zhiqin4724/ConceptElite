import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

interface ServiceCard {
  logo: string;
  title: string;
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
    { logo: '../../assets/icon/haircut.png', title: 'Haircut' },
    { logo: '../../assets/icon/hair-comb.png', title: 'Styling' },
    { logo: '../../assets/icon/color-palette.png', title: 'Coloration' },
    { logo: '../../assets/icon/massage.png', title: 'Treatment' },
  ];

  private readonly barberServices: ServiceCard[] = [
    { logo: '../../assets/icon/haircut.png', title: 'Barber Cut' },
  ];

  /** Service cards shown for the current theme. */
  readonly services = computed<ServiceCard[]>(() =>
    this.theme.mode() === 'barber' ? this.barberServices : this.coiffureServices,
  );

  /** True when the active mode only offers a single service. */
  readonly isSingleService = computed(() => this.services().length === 1);
}

