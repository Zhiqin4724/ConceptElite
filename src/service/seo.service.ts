import { DOCUMENT, Inject, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ThemeService, ThemeMode } from './theme.service';
import {
  SeoData,
  SeoSiteConfig,
  SeoThemeConfig,
} from '../model/seo.model';
import seoData from '../data/seo.json';

const DATA = seoData as SeoData;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly theme = inject(ThemeService);

  private readonly site: SeoSiteConfig = DATA.site;
  private readonly themes: Record<string, SeoThemeConfig> = DATA.themes;

  constructor(@Inject(DOCUMENT) private readonly doc: Document) {}

  applyForTheme(mode: ThemeMode): void {
    const cfg = this.themes[mode];
    if (!cfg) return;

    const url = this.site.origin + cfg.path;

    this.theme.set(mode);
    this.title.setTitle(cfg.title);

    this.upsertMeta('name', 'description', cfg.description);
    this.upsertMeta('property', 'og:title', cfg.title);
    this.upsertMeta('property', 'og:description', cfg.description);
    this.upsertMeta('property', 'og:type', 'website');
    this.upsertMeta('property', 'og:url', url);
    this.upsertMeta('name', 'twitter:card', 'summary_large_image');
    this.upsertMeta('name', 'twitter:title', cfg.title);
    this.upsertMeta('name', 'twitter:description', cfg.description);

    this.setCanonical(url);
    this.setAlternateLinks();
    this.setLang(this.site.defaultLang);
    this.setStructuredData(cfg, url);
  }

  private upsertMeta(attr: 'name' | 'property', key: string, content: string) {
    const selector = `${attr}="${key}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: key, content });
    } else {
      this.meta.addTag({ [attr]: key, content });
    }
  }

  private setCanonical(url: string) {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /** Tells Google that all theme URLs are alternates of the same brand. */
  private setAlternateLinks() {
    this.doc
      .querySelectorAll('link[rel="alternate"][data-seo="theme"]')
      .forEach((el) => el.remove());

    Object.values(this.themes).forEach((cfg) => {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('href', this.site.origin + cfg.path);
      link.setAttribute('hreflang', this.site.defaultLang);
      link.dataset['seo'] = 'theme';
      this.doc.head.appendChild(link);
    });
  }

  private setLang(lang: string) {
    this.doc.documentElement.setAttribute('lang', lang);
  }

  private setStructuredData(cfg: SeoThemeConfig, url: string) {
    const id = 'ce-jsonld';
    this.doc.getElementById(id)?.remove();

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': cfg.schemaType,
      name: cfg.businessName,
      url,
      description: cfg.description,
      address: {
        '@type': 'PostalAddress',
        ...(cfg.address ?? this.site.address),
      },
    });
    this.doc.head.appendChild(script);
  }
}
