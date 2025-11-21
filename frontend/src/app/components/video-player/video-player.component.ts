import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnChanges {
  @Input() trailerUrl: string = '';
  @Input() filmNaslov: string = '';

  safeUrl: SafeResourceUrl | null = null;
  showPlayer: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.sanitizeUrl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trailerUrl']) {
      this.sanitizeUrl();
    }
  }

  sanitizeUrl(): void {
    if (this.trailerUrl) {
      // Dodaj autoplay parametar za YouTube
      let url = this.trailerUrl;
      if (url.includes('youtube.com/embed/')) {
        url = url + '?autoplay=1&rel=0';
      }
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  playTrailer(): void {
    this.showPlayer = true;
  }

  closePlayer(): void {
    this.showPlayer = false;
  }
}
