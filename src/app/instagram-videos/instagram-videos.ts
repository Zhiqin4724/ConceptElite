import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StylistService } from '../../service/stylist.service';

interface InstagramVideo {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
}

@Component({
  selector: 'app-instagram-videos',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './instagram-videos.html',
  styleUrls: ['./instagram-videos.css'],
})
export class InstagramVideosComponent implements OnInit {
  videos: InstagramVideo[] = [];
  visibleCount = 4;
  currentIndex = 0;
  currentSlide: InstagramVideo[] = [];
  nextSlide: InstagramVideo[] = [];
  isAnimating = false;
  animationClass = '';
  
  selectedVideo: InstagramVideo | null = null;

  constructor(private stylistService: StylistService) {}

  ngOnInit(): void {
    // Get all portfolio images from stylists for video thumbnails
    const stylists = this.stylistService.getAll();
    let videoId = 1;
    
    stylists.forEach(stylist => {
      if (stylist.portfolioImages && stylist.portfolioImages.length > 0) {
        stylist.portfolioImages.forEach(imageUrl => {
          this.videos.push({
            id: videoId.toString(),
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnail: imageUrl,
            alt: `${stylist.name} - Video ${videoId}`,
          });
          videoId++;
        });
      }
    });
    
    this.currentSlide = this.getSlice(0);
    if (this.videos.length > 0) {
      this.selectedVideo = this.videos[0];
    }
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex + this.visibleCount < this.videos.length;
  }

  prev(): void {
    if (!this.canGoPrev || this.isAnimating) return;
    this.transition(this.currentIndex - 1, 'enter-right');
  }

  next(): void {
    if (!this.canGoNext || this.isAnimating) return;
    this.transition(this.currentIndex + 1, 'enter-left');
  }

  selectVideo(video: InstagramVideo): void {
    this.selectedVideo = video;
  }

  private getSlice(index: number): InstagramVideo[] {
    return this.videos.slice(index, index + this.visibleCount);
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

  trackByVideoId(_index: number, video: InstagramVideo): string {
    return video.id;
  }
}
