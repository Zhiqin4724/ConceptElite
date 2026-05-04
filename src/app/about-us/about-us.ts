import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

interface AboutBlock {
  eyebrow: string;
  title: string;
  body: string;
  welcome?: string;
  image: string;
  imageAlt: string;
  cta?: { label: string; targetId?: string };
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  private readonly theme = inject(ThemeService);

  private readonly coiffureBlocks: AboutBlock[] = [
    {
      eyebrow: 'Expert Hair Services',
      title: 'Top-Grade Care, Delivered by Professionals',
      body:
        "Concept Elite Coiffure is where craft meets care. Every cut, colour and treatment is performed by seasoned stylists who have spent years mastering their discipline — so you walk out with hair that looks, feels and behaves the way you want it to.",
      welcome: 'Welcome to Concept Elite Coiffure.',
      image: 'assets/about/salon-lounge.jpg',
      imageAlt: 'Concept Elite Coiffure salon lounge',
      cta: { label: 'EXPLORE OUR SERVICES', targetId: 'services' },
    },
    {
      eyebrow: 'Curated Product Selection',
      title: 'Premium Products for Every Hair Need',
      body:
        'From everyday care to professional-grade treatments, our in-salon boutique stocks a wide range of trusted brands. Whatever your hair type, texture or routine, our team will guide you to the right products to keep your style at its best between visits.',
      welcome: 'Discover what your hair has been waiting for.',
      image: 'assets/about/salon-detail.jpg',
      imageAlt: 'Concept Elite Coiffure product display',
      cta: { label: 'EXPLORE OUR PRODUCTS', targetId: 'products' },
    },
  ];

  private readonly barberBlocks: AboutBlock[] = [
    {
      eyebrow: 'Precision Barbering for Men',
      title: 'Sharp Cuts, Crafted by Master Barbers',
      body:
        "Concept Elite Barber is built around precision. Our barbers specialise in men's cuts, fades, beard sculpting and hot-towel shaves — every line clean, every transition seamless. You're in the chair of a true professional, and it shows the moment you stand up.",
      welcome: 'Welcome to Concept Elite Barber.',
      image: 'assets/about/salon-lounge.jpg',
      imageAlt: 'Concept Elite Barber shop interior',
      cta: { label: 'EXPLORE OUR SERVICES', targetId: 'services' },
    },
    {
      eyebrow: 'Grooming Essentials',
      title: 'Products Engineered for Men',
      body:
        "Pomades, beard oils, clay, styling creams and skincare \u2014 hand-picked for the modern man and the cuts we deliver. Whatever your hair type or grooming routine, we'll match you with the right products so your look holds long after you leave the chair.",
      welcome: 'Sharp on the chair. Sharp at home.',
      image: 'assets/about/salon-detail.jpg',
      imageAlt: 'Concept Elite Barber grooming products',
      cta: { label: 'EXPLORE OUR PRODUCTS', targetId: 'products' },
    },
  ];

  readonly blocks = computed<AboutBlock[]>(() =>
    this.theme.mode() === 'barber' ? this.barberBlocks : this.coiffureBlocks,
  );

  scrollTo(id?: string): void {
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
