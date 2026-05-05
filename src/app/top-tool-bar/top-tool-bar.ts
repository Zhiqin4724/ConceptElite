import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ThemeService, ThemeMode } from '../../service/theme.service';

interface NavLink {
  label: string;
  fragment: string;
  route?: string;
  action?: 'toggle-theme';
}

const SHOP_LINK: NavLink = { label: 'SHOP', fragment: '', route: '/shop' };

const HOME_NAV: NavLink[] = [
  { label: 'ABOUT US', fragment: 'about-us' },
  { label: 'SERVICE', fragment: 'services' },
  { label: 'LOCATION', fragment: 'location' },
  SHOP_LINK,
];

const STYLIST_NAV: NavLink[] = [
  { label: 'HOME', fragment: '' },
  { label: 'BOOKING', fragment: 'booking' },
  SHOP_LINK,
];

const DEFAULT_NAV: NavLink[] = [
  { label: 'HOME', fragment: '' },
  SHOP_LINK,
];

/** Routes that are considered "home" (one per theme). */
const HOME_PATHS = new Set<string>(['/', '/coiffure', '/le-barbier']);

const THEME_PATHS: Record<ThemeMode, string> = {
  coiffure: '/coiffure',
  barber: '/le-barbier',
};

@Component({
  selector: 'app-top-tool-bar',
  standalone: true,
  imports: [CommonModule],
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

  private lastScrollY = 0;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  /** Label shown for the theme switcher; reflects the *target* mode. */
  get themeToggleLabel(): string {
    return this.currentTheme === 'coiffure' ? 'BARBER' : 'COIFFURE';
  }

  private buildLinks(base: NavLink[]): NavLink[] {
    return [
      ...base,
      { label: this.themeToggleLabel, fragment: '', action: 'toggle-theme' },
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
      typeof link === 'string' ? { label: '', fragment: link } : link;

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