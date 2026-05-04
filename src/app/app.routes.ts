import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
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