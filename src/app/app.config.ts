import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// #E7CD78
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
