import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { catchError, of } from 'rxjs';
import {
  CatalogFacet,
  CatalogItem,
  SortOption,
} from '../../model/product.model';
import { ProductService } from '../../service/product.service';

type FacetField = CatalogFacet['field'];

const PAGE_SIZE = 24;

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
  ],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {
  private readonly products = inject(ProductService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<CatalogItem[]>([]);

  readonly query = signal('');
  readonly sort = signal<SortOption>('relevance');
  readonly selected = signal<Record<FacetField, Set<string>>>({
    brand: new Set(),
    categories: new Set(),
    tags: new Set(),
  });

  readonly priceBounds = computed(() => {
    const prices = this.items().map((i) => i.salePrice ?? i.price);
    if (!prices.length) return { min: 0, max: 0 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  });
  readonly priceMax = signal<number | null>(null);

  readonly currentPage = signal(0);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const sel = this.selected();
    const cap = this.priceMax();
    let list = this.items().filter((item) => {
      if (q) {
        const hay =
          `${item.name} ${item.description} ${item.brand ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (sel.brand.size && !(item.brand && sel.brand.has(item.brand)))
        return false;
      if (
        sel.categories.size &&
        !item.categories.some((c) => sel.categories.has(c))
      )
        return false;
      // if (sel.tags.size && !item.tags.some((t) => sel.tags.has(t)))
      //   return false;
      if (cap != null) {
        const effective = item.salePrice ?? item.price;
        if (effective > cap) return false;
      }
      return true;
    });

    switch (this.sort()) {
      case 'price-asc':
        list = [...list].sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
        );
        break;
      case 'price-desc':
        list = [...list].sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
        );
        break;
      case 'name-asc':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    return list;
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.filtered().length / PAGE_SIZE),
  );

  readonly pagedItems = computed(() => {
    const page = this.currentPage();
    const start = page * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  readonly pages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const windowSize = 4; // Number of buttons in the sliding window

    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i);
    }

    // Logic for the middle 4 buttons
    let start = Math.max(current - 1, 0);
    let end = start + windowSize;

    if (end > total) {
      end = total;
      start = Math.max(end - windowSize, 0);
    }

    // If we are very close to the start, force start at 0
    if (current < 3) {
      start = 0;
      end = windowSize;
    }
    // If we are very close to the end, force end to total
    else if (current > total - 4) {
      start = total - windowSize;
      end = total;
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  });

  readonly facets = computed<CatalogFacet[]>(() => {
    const sel = this.selected();
    const buildFacet = (
      field: FacetField,
      label: string,
      pick: (i: CatalogItem) => string[],
    ): CatalogFacet => {
      const counts = new Map<string, number>();
      for (const item of this.items()) {
        for (const v of pick(item)) {
          if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
        }
      }
      const values = [...counts.entries()]
        .map(([value, count]) => ({
          value,
          count,
          selected: sel[field].has(value),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
      return { field, label, values };
    };

    return [
      buildFacet('brand', 'Brand', (i) => (i.brand ? [i.brand] : [])),
      buildFacet('categories', 'Category', (i) => i.categories),
      // buildFacet('tags', 'Tags', (i) => i.tags),
    ];
  });

  constructor(private productService: ProductService) {
    this.products
      .fetchCatalog()
      .pipe(
        catchError((err) => {
          console.error('[shop] catalog error:', err);
          this.error.set(
            err?.status
              ? `Failed to load catalog (HTTP ${err.status}). Check your .env credentials and dev proxy.`
              : 'Failed to load catalog. Is the dev server running with the proxy?',
          );
          return of([] as CatalogItem[]);
        }),
      )
      .subscribe((list) => {
        this.items.set(list);
        this.loading.set(false);
      });
  }
  ngOnInit(): void {
    // This will run automatically as soon as the Shop component initializes
    this.autoExportCatalog();
  }

  private autoExportCatalog(): void {
    console.log('Auto-generating catalog audit for verification...');
    this.productService.exportCatalogData();
  }

  trackById(_index: number, item: CatalogItem): string {
    return item.id;
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetPage(): void {
    this.currentPage.set(0);
  }

  toggleFacet(field: FacetField, value: string): void {
    const next: Record<FacetField, Set<string>> = {
      brand: new Set(this.selected().brand),
      categories: new Set(this.selected().categories),
      tags: new Set(this.selected().tags),
    };
    if (next[field].has(value)) next[field].delete(value);
    else next[field].add(value);
    this.selected.set(next);
    this.currentPage.set(0);
  }

  clearAll(): void {
    this.query.set('');
    this.priceMax.set(null);
    this.selected.set({
      brand: new Set(),
      categories: new Set(),
      tags: new Set(),
    });
    this.currentPage.set(0);
  }

  onPriceChange(value: number): void {
    this.priceMax.set(value);
    this.currentPage.set(0);
  }

  hasActiveFilters = computed(() => {
    const sel = this.selected();
    return (
      !!this.query() ||
      this.priceMax() != null ||
      sel.brand.size + sel.categories.size + sel.tags.size > 0
    );
  });
}