import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopToolBar } from './top-tool-bar/top-tool-bar';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import { Map } from './map/map';
import { BrandFeature } from './brand-feature/brand-feature';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { AboutUs } from './about-us/about-us';
import { Services } from './services/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopToolBar,
    Footer,
    Main,
    BrandFeature,
    MatGridListModule,
    Map,
    AboutUs,
    Services
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'concept-elite';
}
