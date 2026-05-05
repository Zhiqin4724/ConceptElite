import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../service/theme.service';

interface AboutBlock {
  /** Translation namespace under `about.<theme>.<key>.*` */
  i18nKey: string;
  image: string;
  hasWelcome: boolean;
  cta?: { targetId?: string; route?: string };
}

type ThemeKey = 'coiffure' | 'barber';

interface AboutBlockConfig {
  i18nKey: string;
  images: Record<ThemeKey, string>;
  hasWelcome: boolean;
  cta?: { targetId?: string; route?: string };
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  /** Layout/asset config (text comes from i18n). */
  private readonly blocksConfig: AboutBlockConfig[] = [
    {
      i18nKey: 'services',
      images: {
        coiffure: 'https://picsum.photos/seed/conceptelite-coiffure-services/1200/900',
        barber: 'https://picsum.photos/seed/conceptelite-barber-services/1200/900',
      },
      hasWelcome: true,
      cta: { targetId: 'services' },
    },
    {
      i18nKey: 'products',
      images: {
        coiffure: 'https://picsum.photos/seed/conceptelite-coiffure-products/1200/900',
        barber: 'https://picsum.photos/seed/conceptelite-barber-products/1200/900',
      },
      hasWelcome: true,
      cta: { route: '/shop' },
    },
  ];

  readonly themeKey = computed(() => this.theme.mode()); // 'coiffure' | 'barber'
  readonly blocks = computed<AboutBlock[]>(() => {
    const theme = this.themeKey() as ThemeKey;
    return this.blocksConfig.map((block) => ({
      i18nKey: block.i18nKey,
      image: block.images[theme] ?? block.images.coiffure,
      hasWelcome: block.hasWelcome,
      cta: block.cta,
    }));
  });

  handleCta(cta: AboutBlock['cta']): void {
    if (!cta) return;
    if (cta.route) {
      this.router.navigate([cta.route]);
      return;
    }
    if (cta.targetId) {
      document
        .getElementById(cta.targetId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
