import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../service/theme.service';

interface HeroVisuals {
  backgroundUrl: string;
  variant: 'light' | 'dark';
  /** Translation namespace under `hero.*` (e.g. 'coiffure', 'barber'). */
  i18nKey: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class HeroComponent {
  private readonly theme = inject(ThemeService);

  private readonly coiffure: HeroVisuals = {
    backgroundUrl:
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1600&q=80',
    variant: 'light',
    i18nKey: 'coiffure',
  };

  private readonly barber: HeroVisuals = {
    backgroundUrl:
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=80',
    variant: 'dark',
    i18nKey: 'barber',
  };

  readonly hero = computed<HeroVisuals>(() =>
    this.theme.mode() === 'barber' ? this.barber : this.coiffure,
  );
}
