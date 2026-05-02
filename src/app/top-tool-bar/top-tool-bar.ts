import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface NavLink {
  label: string;
  fragment: string;
}

const NAV_CONFIG: Record<string, NavLink[]> = {
  '/': [
    { label: 'ABOUT US', fragment: 'about-us' },
    { label: 'SERVICE', fragment: 'services' },
    { label: 'LOCATION', fragment: 'location' },
  ],
  '/stylists': [
    { label: 'HOME', fragment: '' },
    { label: 'BOOKING', fragment: 'booking' },
  ],
};

const DEFAULT_NAV: NavLink[] = [{ label: 'HOME', fragment: '' }];

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

  private lastScrollY = 0;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

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

    if (path === '/') {
      this.navLinks = NAV_CONFIG['/'];
    } else if (path.startsWith('/stylists/')) {
      this.navLinks = NAV_CONFIG['/stylists'];
    } else {
      this.navLinks = DEFAULT_NAV;
    }
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

  navigateTo(fragment: string) {
    this.closeMenu();

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