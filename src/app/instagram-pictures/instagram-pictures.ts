import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StylistService } from '../../service/stylist.service';

interface InstagramPicture {
  id: string;
  url: string;
  alt: string;
}

@Component({
  selector: 'app-instagram-pictures',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './instagram-pictures.html',
  styleUrls: ['./instagram-pictures.css'],
})
export class InstagramPicturesComponent implements OnInit {
  pictures: InstagramPicture[] = [];
  visibleCount = 5;
  currentIndex = 0;
  currentSlide: InstagramPicture[] = [];
  nextSlide: InstagramPicture[] = [];
  isAnimating = false;
  animationClass = '';
  
  selectedPicture: InstagramPicture | null = null;
  showModal = false;

  constructor(private stylistService: StylistService) {}

  ngOnInit(): void {
    // Get all portfolio images from stylists
    const stylists = this.stylistService.getAll();
    let pictureId = 1;
    
    stylists.forEach(stylist => {
      if (stylist.portfolioImages && stylist.portfolioImages.length > 0) {
        stylist.portfolioImages.forEach(imageUrl => {
          this.pictures.push({
            id: pictureId.toString(),
            url: imageUrl,
            alt: `${stylist.name} - Portfolio ${pictureId}`,
          });
          pictureId++;
        });
      }
    });
    
    this.currentSlide = this.getSlice(0);

    // Pre-select the first picture so the main display isn't empty on load.
    if (this.pictures.length > 0) {
      this.selectedPicture = this.pictures[0];
    }
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex + this.visibleCount < this.pictures.length;
  }

  prev(): void {
    if (!this.canGoPrev || this.isAnimating) return;
    this.transition(this.currentIndex - 1, 'enter-right');
  }

  next(): void {
    if (!this.canGoNext || this.isAnimating) return;
    this.transition(this.currentIndex + 1, 'enter-left');
  }

  openPicture(picture: InstagramPicture): void {
    this.selectedPicture = picture;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPicture = null;
  }

  private getSlice(index: number): InstagramPicture[] {
    return this.pictures.slice(index, index + this.visibleCount);
  }

  private transition(newIndex: number, direction: 'enter-left' | 'enter-right'): void {
    this.isAnimating = true;
    this.nextSlide = this.getSlice(newIndex);
    this.animationClass = direction;

    setTimeout(() => {
      this.currentIndex = newIndex;
      this.currentSlide = this.nextSlide;
      this.nextSlide = [];
      this.animationClass = '';
      this.isAnimating = false;
    }, 500);
  }

  trackByPictureId(_index: number, picture: InstagramPicture): string {
    return picture.id;
  }
}
