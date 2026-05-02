import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { Map } from '../../map/map';
import { BrandFeature } from '../../brand-feature/brand-feature';
import { AboutUs } from '../../about-us/about-us';
import { Services } from '../../services/services';
import { StylistsCarouselComponent } from '../../carousel/stylist-carousel';

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
  ],
  template: `
    <main class="main" style="padding-top: 80px;">
      <!-- <app-main></app-main> -->
      <app-about-us id="about-us"></app-about-us>
      <app-services id="services"></app-services>
      <app-stylists-carousel></app-stylists-carousel>
      <app-map id="location"></app-map>
      <app-brand-feature></app-brand-feature>
    </main>
  `,
})
export class HomeComponent {}