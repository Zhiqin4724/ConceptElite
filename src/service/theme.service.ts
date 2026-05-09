import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'coiffure' | 'barber';

const STORAGE_KEY = 'ce-theme-mode';

/**
 * Switches the site between the hair-salon ("coiffure") and barber experiences.
 * - Persists the choice in localStorage.
 * - Toggles a `theme-barber` class on <html> for global CSS theming.
 * - Components read `mode()` to vary their content (services list, map locations, etc.).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.load());

  constructor() {
    this.apply(this.mode());
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
    this.apply(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* storage unavailable - ignore */
    }
  }

  toggle(): void {
    this.set(this.mode() === 'coiffure' ? 'barber' : 'coiffure');
  }

  private load(): ThemeMode {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'barber' || v === 'coiffure') return v;
    } catch {
      /* ignore */
    }
    return 'coiffure';
  }

  private apply(mode: ThemeMode): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('theme-barber', mode === 'barber');
    root.classList.toggle('theme-coiffure', mode === 'coiffure');
  }
}
