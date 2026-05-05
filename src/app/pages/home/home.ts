import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { Map } from '../../map/map';
import { BrandFeature } from '../../brand-feature/brand-feature';
import { AboutUs } from '../../about-us/about-us';
import { Services } from '../../services/services';
import { StylistsCarouselComponent } from '../../carousel/stylist-carousel';
import { InstagramPicturesComponent } from '../../instagram-pictures/instagram-pictures';
import { InstagramVideosComponent } from '../../instagram-videos/instagram-videos';
import { HeroComponent } from '../../hero/hero';
import { SeoService } from '../../../service/seo.service';
import { ThemeMode } from '../../../service/theme.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    BrandFeature,
    Map,
    AboutUs,
    Services,
    StylistsCarouselComponent,
    InstagramPicturesComponent,
    InstagramVideosComponent,
    HeroComponent,
    RevealOnScrollDirective,
  ],
  template: `
    <main class="main" style="padding-top: 80px;">
      <app-hero></app-hero>
      <app-about-us id="about-us" appRevealOnScroll [revealDelay]="70"></app-about-us>
      <app-services id="services" appRevealOnScroll [revealDelay]="100"></app-services>
      <app-stylists-carousel appRevealOnScroll [revealDelay]="120"></app-stylists-carousel>
      <app-instagram-pictures appRevealOnScroll [revealDelay]="140"></app-instagram-pictures>
      <app-instagram-videos appRevealOnScroll [revealDelay]="160"></app-instagram-videos>
      <app-map id="location"></app-map>
      <app-brand-feature appRevealOnScroll [revealDelay]="180"></app-brand-feature>
    </main>
  `,
})
export class HomeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    // Subscribe so theme/SEO update when navigating between
    // /coiffure and /le-barbier (same component is reused).
    this.route.data.subscribe((data) => {
      const theme = (data['theme'] as ThemeMode) ?? 'coiffure';
      this.seo.applyForTheme(theme);
    });
  }
}