import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ThemeService } from '../../service/theme.service';

interface NavLink {
  label: string;
  fragment: string;
  route?: string;
  action?: 'toggle-theme';
}

const SHOP_LINK: NavLink = { label: 'SHOP', fragment: '', route: '/shop' };

const NAV_CONFIG: Record<string, NavLink[]> = {
  '/': [
    { label: 'ABOUT US', fragment: 'about-us' },
    { label: 'SERVICE', fragment: 'services' },
    { label: 'LOCATION', fragment: 'location' },
    SHOP_LINK,
  ],
  '/stylists': [
    { label: 'HOME', fragment: '' },
    { label: 'BOOKING', fragment: 'booking' },
    SHOP_LINK,
  ],
};

const DEFAULT_NAV: NavLink[] = [
  { label: 'HOME', fragment: '' },
  SHOP_LINK,
];

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

  private readonly theme = inject(ThemeService);

  private lastScrollY = 0;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  /** Label shown for the theme switcher; reflects the *target* mode. */
  get themeToggleLabel(): string {
    return this.theme.mode() === 'coiffure' ? 'BARBER' : 'COIFFURE';
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

  private updateNavLinks(url: string) {
    const path = url.split('?')[0].split('#')[0];

    let base: NavLink[];
    if (path === '/') {
      base = NAV_CONFIG['/'];
    } else if (path.startsWith('/stylists/')) {
      base = NAV_CONFIG['/stylists'];
    } else {
      base = DEFAULT_NAV;
    }

    this.navLinks = this.buildLinks(base);
  }

  goHome() {
    this.closeMenu();
    this.router.navigate(['/']);
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
      this.theme.toggle();
      // Refresh nav labels (and re-render content that depends on the mode).
      this.updateNavLinks(this.router.url || '/');
      return;
    }

    if (target.route) {
      this.router.navigate([target.route]);
      return;
    }

    const fragment = target.fragment;

    if (!fragment) {
      this.router.navigate(['/']);
      return;
    }

    // If already on home, just scroll
    if (this.router.url === '/') {
      setTimeout(() => {
        document
          .getElementById(fragment)
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Navigate home first, then scroll after the page loads
      this.router.navigate(['/']).then(() => {
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