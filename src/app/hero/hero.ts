import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

interface HeroContent {
  backgroundUrl: string;
  title: string;
  highlight?: string;
  subtitle: string;
  cta: string;
  variant: 'light' | 'dark';
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class HeroComponent {
  private readonly theme = inject(ThemeService);

  private readonly coiffure: HeroContent = {
    backgroundUrl:
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1600&q=80',
    title: "L'art de sublimer votre",
    highlight: 'beauté',
    subtitle: 'Expertise · Élégance · Perfection',
    cta: 'Prenez rendez-vous',
    variant: 'light',
  };

  private readonly barber: HeroContent = {
    backgroundUrl:
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=80',
    title: "L'art de sculpter votre",
    highlight: 'style',
    subtitle: 'Précision · Tradition · Caractère',
    cta: 'Réserver une coupe',
    variant: 'dark',
  };

  readonly hero = computed<HeroContent>(() =>
    this.theme.mode() === 'barber' ? this.barber : this.coiffure,
  );
}
