import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'fr' | 'en';

const STORAGE_KEY = 'ce-lang';
const SUPPORTED: Lang[] = ['fr', 'en'];
const DEFAULT_LANG: Lang = 'fr';

/**
 * Wraps ngx-translate with a signal-based API and localStorage persistence.
 * Mirrors the structure of ThemeService for consistency.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  readonly lang = signal<Lang>(this.load());

  init(): void {
    this.translate.addLangs(SUPPORTED);
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.translate.use(this.lang());
  }

  set(lang: Lang): void {
    if (!SUPPORTED.includes(lang)) return;
    this.lang.set(lang);
    this.translate.use(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable - ignore */
    }
  }

  toggle(): void {
    this.set(this.lang() === 'fr' ? 'en' : 'fr');
  }

  private load(): Lang {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'fr' || v === 'en') return v;
    } catch {
      /* ignore */
    }
    return DEFAULT_LANG;
  }
}
