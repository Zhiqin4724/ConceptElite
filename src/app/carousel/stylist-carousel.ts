import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { StylistCardComponent } from '../../component/card/stylist-card.component';
import { StylistService } from '../../service/stylist.service';
import { Stylist } from '../../model/stylist.model';

@Component({
  selector: 'app-stylists-carousel',
  imports: [CommonModule, StylistCardComponent],
  templateUrl: './stylist-carousel.html',
  styleUrls: ['./stylist-carousel.css'],
})
export class StylistsCarouselComponent implements OnInit {
 
  allStylists: Stylist[] = [];
  filteredStylists: Stylist[] = [];
 
  locations: string[] = ['Deux-Montagnes', 'LaSalle', 'Dorval', 'Duvernay', 'Longueuil', 'Pointe-Claire', 'Brossard'];
  selectedLocation: string | null = null;
  dropdownOpen = false;
 
  visibleCount = 5;
  currentIndex = 0;
 
  currentSlide: Stylist[] = [];
  nextSlide: Stylist[] = [];
  isAnimating = false;
  animationClass = '';
 
  // Fixed card width: always 1/5 of track minus gaps, never depends on how many cards are showing
 
  constructor(private stylistService: StylistService) {}
 
  ngOnInit(): void {
    this.allStylists = this.stylistService.getAll();
    this.applyFilter();
  }
 
  applyFilter(): void {
    this.filteredStylists = this.selectedLocation
      ? this.allStylists.filter(s => s.location === this.selectedLocation)
      : [...this.allStylists];
    this.currentIndex = 0;
    this.currentSlide = this.getSlice(0);
    this.nextSlide = [];
    this.animationClass = '';
    this.isAnimating = false;
  }
 
  selectLocation(location: string | null): void {
    this.selectedLocation = location;
    this.dropdownOpen = false;
    this.applyFilter();
  }
 
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
 
  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }
 
  get canGoNext(): boolean {
    return this.currentIndex + this.visibleCount < this.filteredStylists.length;
  }
 
  prev(): void {
    if (!this.canGoPrev || this.isAnimating) return;
    this.transition(this.currentIndex - 1, 'enter-right');
  }
 
  next(): void {
    if (!this.canGoNext || this.isAnimating) return;
    this.transition(this.currentIndex + 1, 'enter-left');
  }
 
  private getSlice(index: number): Stylist[] {
    return this.filteredStylists.slice(index, index + this.visibleCount);
  }
 
  private transition(newIndex: number, enterClass: string): void {
    this.isAnimating = true;
    this.nextSlide = this.getSlice(newIndex);
    this.animationClass = enterClass;
 
    setTimeout(() => {
      this.currentIndex = newIndex;
      this.currentSlide = this.nextSlide;
      this.nextSlide = [];
      this.animationClass = '';
      this.isAnimating = false;
    }, 400);
  }
 
  trackBySlug(_: number, stylist: Stylist): string {
    return stylist.slug;
  }
}