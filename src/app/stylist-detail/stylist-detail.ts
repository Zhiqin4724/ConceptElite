import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StylistService } from '../../service/stylist.service';
import { Stylist } from '../../model/stylist.model';
import { Footer } from '../footer/footer';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stylist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer, PaginationComponent],
  templateUrl: './stylist-detail.html',
  styleUrls: ['./stylist-detail.css']
})
export class StylistDetailComponent implements OnInit {

  stylist: Stylist | undefined;

  readonly pageSize = 12;
  currentPage = 1;

  get totalPages(): number {
    // Always at least 1 page even if no images
    return Math.max(1, Math.ceil((this.stylist?.portfolioImages?.length ?? 0) / this.pageSize));
  }

  get paginatedImages(): string[] {
    const images = this.stylist?.portfolioImages ?? [];
    const start = (this.currentPage - 1) * this.pageSize;
    return images.slice(start, start + this.pageSize);
  }

  constructor(
    private route: ActivatedRoute,
    private stylistService: StylistService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.stylist = this.stylistService.getBySlug(slug);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  goBack(): void {
  this.location.back();
}
}