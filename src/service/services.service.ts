import { Injectable } from '@angular/core';
import { ServiceCard } from '../model/service.model';
import { ThemeMode } from './theme.service';
import servicesData from '../data/services.json';

type ServicesByTheme = Record<ThemeMode, ServiceCard[]>;

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly services: ServicesByTheme = servicesData as ServicesByTheme;

  getByTheme(mode: ThemeMode): ServiceCard[] {
    return this.services[mode] ?? [];
  }
}
