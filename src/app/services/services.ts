import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { ServicesService } from '../../service/services.service';
import { ServiceCard } from '../../model/service.model';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  private readonly theme = inject(ThemeService);
  private readonly servicesService = inject(ServicesService);

  readonly services = computed<ServiceCard[]>(() =>
    this.servicesService.getByTheme(this.theme.mode()),
  );

  readonly isSingleService = computed(() => this.services().length === 1);
}
