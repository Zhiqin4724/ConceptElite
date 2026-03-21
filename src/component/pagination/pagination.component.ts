import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  visiblePages: (number | '...')[] = [];

  ngOnChanges(): void {
    this.buildPages();
  }

  buildPages(): void {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | '...')[] = [];

    if (total <= 5) {
      // Show all if 5 or fewer
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      // Always show first
      pages.push(1);

      if (current <= 3) {
        // Near start: 1, 2, 3 ... last
        pages.push(2);
        pages.push(3);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        // Near end: 1 ... n-2, n-1, n
        pages.push('...');
        pages.push(total - 2);
        pages.push(total - 1);
        pages.push(total);
      } else {
        // Middle: 1 ... prev, current, next ... last
        pages.push('...');
        pages.push(current - 1);
        pages.push(current);
        pages.push(current + 1);
        pages.push('...');
        pages.push(total);
      }
    }

    this.visiblePages = pages;
  }

  goTo(page: number | '...'): void {
    if (page === '...') return;
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  isActive(page: number | '...'): boolean {
    return page === this.currentPage;
  }
}