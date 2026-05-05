import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
    data: { theme: 'coiffure' },
  },
  {
    path: 'coiffure',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
    data: { theme: 'coiffure' },
  },
  {
    path: 'le-barbier',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
    data: { theme: 'barber' },
  },
  {
    path: 'stylists/:slug',
    loadComponent: () =>
      import('./stylist-detail/stylist-detail').then(
        (m) => m.StylistDetailComponent,
      ),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./shop/shop').then((m) => m.ShopComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];