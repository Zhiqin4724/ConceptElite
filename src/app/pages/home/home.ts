import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { TopToolBar } from '../../top-tool-bar/top-tool-bar';
import { Footer } from '../../footer/footer';
import { Main } from '../../main/main';
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
    TopToolBar,
    Footer,
    Main,
    BrandFeature,
    Map,
    AboutUs,
    Services,
    StylistsCarouselComponent,
  ],
  template: `
    <main class="main">
      <app-top-tool-bar></app-top-tool-bar>
      <app-main></app-main>
      <app-about-us></app-about-us>
      <app-services></app-services>
      <app-stylists-carousel></app-stylists-carousel>
      <app-map></app-map>
      <app-brand-feature></app-brand-feature>
      <app-footer></app-footer>
    </main>
  `
})
export class HomeComponent {}