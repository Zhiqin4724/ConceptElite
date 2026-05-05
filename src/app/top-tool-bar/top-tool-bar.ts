import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';
import { ThemeService, ThemeMode } from '../../service/theme.service';
import { LanguageService } from '../../service/language.service';

interface NavLink {
  /** Translation key under `nav.*` */
  labelKey: string;
  fragment: string;
  route?: string;
  action?: 'toggle-theme' | 'toggle-lang';
}

const SHOP_LINK: NavLink = { labelKey: 'nav.shop', fragment: '', route: '/shop' };

const HOME_NAV: NavLink[] = [
  { labelKey: 'nav.aboutUs', fragment: 'about-us' },
  { labelKey: 'nav.service', fragment: 'services' },
  { labelKey: 'nav.location', fragment: 'location' },
  SHOP_LINK,
];

const STYLIST_NAV: NavLink[] = [
  { labelKey: 'nav.home', fragment: '' },
  { labelKey: 'nav.booking', fragment: 'booking' },
  SHOP_LINK,
];

const DEFAULT_NAV: NavLink[] = [
  { labelKey: 'nav.home', fragment: '' },
  SHOP_LINK,
];

const LANG_TOGGLE: NavLink = {
  labelKey: 'language.label',
  fragment: '',
  action: 'toggle-lang',
};

/** Routes that are considered "home" (one per theme). */
const HOME_PATHS = new Set<string>(['/', '/coiffure', '/le-barbier']);

const THEME_PATHS: Record<ThemeMode, string> = {
  coiffure: '/coiffure',
  barber: '/le-barbier',
};

@Component({
  selector: 'app-top-tool-bar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './top-tool-bar.html',
  styleUrls: ['./top-tool-bar.css'],
})
export class TopToolBar implements OnInit, OnDestroy {
  isMenuOpen = false;
  isHidden = false;
  navLinks: NavLink[] = [];

  /** Theme implied by the *current URL* (independent of the ThemeService signal,
   *  which may briefly lag during navigation). */
  private currentTheme: ThemeMode = 'coiffure';

  private readonly theme = inject(ThemeService);
  private readonly language = inject(LanguageService);

  private lastScrollY = 0;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  /** Translation key for the *target* theme. */
  get themeToggleKey(): string {
    return this.currentTheme === 'coiffure'
      ? 'nav.switchToBarber'
      : 'nav.switchToCoiffure';
  }

  /** Visible label on the language pill — shows the *other* language. */
  get languageToggleLabel(): string {
    return this.language.lang() === 'fr' ? 'EN' : 'FR';
  }

  private buildLinks(base: NavLink[]): NavLink[] {
    return [
      ...base,
      LANG_TOGGLE,
      { labelKey: this.themeToggleKey, fragment: '', action: 'toggle-theme' },
    ];
  }

  ngOnInit() {
    // Use '/' as fallback if url is empty on first load
    const initialUrl = this.router.url || '/';
    this.updateNavLinks(initialUrl);

    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.updateNavLinks(e.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private currentPath(): string {
    return (this.router.url || '/').split('?')[0].split('#')[0];
  }

  private isHomePath(path: string): boolean {
    return HOME_PATHS.has(path);
  }

  private themeFromPath(path: string): ThemeMode {
    return path === '/le-barbier' ? 'barber' : 'coiffure';
  }

  private updateNavLinks(url: string) {
    const path = url.split('?')[0].split('#')[0];
    this.currentTheme = this.themeFromPath(path);

    let base: NavLink[];
    if (this.isHomePath(path)) {
      base = HOME_NAV;
    } else if (path.startsWith('/stylists/')) {
      base = STYLIST_NAV;
    } else {
      // Off-home routes (e.g. /shop): keep the toggle aligned with the
      // theme service so visitors don't lose their preference.
      this.currentTheme = this.theme.mode();
      base = DEFAULT_NAV;
    }

    this.navLinks = this.buildLinks(base);
  }

  goHome() {
    this.closeMenu();
    // Stay on the current theme's URL (so SEO/theme stay aligned).
    this.router.navigate([THEME_PATHS[this.currentTheme]]);
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  navigateTo(link: NavLink | string) {
    this.closeMenu();

    // Backwards-compat: callers may still pass a raw fragment string.
    const target: NavLink =
      typeof link === 'string'
        ? { labelKey: '', fragment: link }
        : link;

    if (target.action === 'toggle-lang') {
      this.language.toggle();
      // Refresh nav so the theme-toggle label re-renders for the new lang.
      this.updateNavLinks(this.router.url || '/');
      return;
    }

    if (target.action === 'toggle-theme') {
      // Navigate to the other theme's URL — the home component's SEO service
      // will switch the theme to match.
      const next: ThemeMode =
        this.currentTheme === 'coiffure' ? 'barber' : 'coiffure';
      this.router.navigate([THEME_PATHS[next]]);
      return;
    }

    if (target.route) {
      this.router.navigate([target.route]);
      return;
    }

    const fragment = target.fragment;
    const homePath = THEME_PATHS[this.currentTheme];

    if (!fragment) {
      this.router.navigate([homePath]);
      return;
    }

    // If already on a home path, just scroll
    if (this.isHomePath(this.currentPath())) {
      setTimeout(() => {
        document
          .getElementById(fragment)
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Navigate home first, then scroll after the page loads
      this.router.navigate([homePath]).then(() => {
        setTimeout(() => {
          document
            .getElementById(fragment)
            ?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollY = window.scrollY;
    this.isHidden = currentScrollY > this.lastScrollY && currentScrollY > 100;
    this.lastScrollY = currentScrollY;
  }
}