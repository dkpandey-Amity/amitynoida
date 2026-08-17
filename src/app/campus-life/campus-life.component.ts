import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-campus-life',
  standalone: true,
  imports: [],
  templateUrl: './campus-life.component.html',
  styleUrls: ['./campus-life.component.css'],
})
export class CampusLifeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sportCarousel') sportCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('sportTrack') sportTrack!: ElementRef<HTMLDivElement>;

  private timer: any;
  private currentIndex = 0;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getCampusLifeMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];

          this.titleService.setTitle(
            metaData.Title || 'Campus Life | Amity University Noida',
          );

          this.meta.updateTag({
            name: 'description',
            content: metaData.Description || '',
          });

          this.meta.updateTag({
            name: 'keywords',
            content: metaData.Keywords || '',
          });

          // Open Graph
          this.meta.updateTag({
            property: 'og:title',
            content: metaData.Title,
          });

          this.meta.updateTag({
            property: 'og:description',
            content: metaData.Description,
          });

          this.meta.updateTag({
            property: 'og:type',
            content: 'website',
          });

          this.meta.updateTag({
            property: 'og:url',
            content: metaData.CanonicalUrl || window.location.href,
          });

          this.meta.updateTag({
            property: 'og:image',
            content:
              'https://noida.amity.edu/assets/images/campus-life-banner.jpg',
          });

          // Twitter
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title,
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content: metaData.Description,
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/images/campus-life-banner.jpg',
          });

          const canonicalUrl = metaData.CanonicalUrl || window.location.href;

          this.setCanonicalLink(canonicalUrl);

          this.injectStructuredData(metaData);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private setCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]',
    );

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private injectStructuredData(metaData: any): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaData.Title,
      description: metaData.Description,
      url: metaData.CanonicalUrl,
    };

    const existing = document.getElementById('structured-data');

    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');

    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  ngAfterViewInit(): void {
    this.initSportsCarousel();

    // Marquee Init
    setTimeout(() => {
      if (typeof $ !== 'undefined' && $.fn && $('#marqueeLeft').length) {
      } else {
        console.error('Marquee plugin not loaded');
      }
    }, 200);
  }

  initSportsCarousel(): void {
    const carousel = this.sportCarousel?.nativeElement;
    const track = this.sportTrack?.nativeElement;

    if (!carousel || !track) return;

    const slides = Array.from(track.children) as HTMLElement[];

    const getVisibleItems = () => {
      if (window.innerWidth <= 767) return 2;
      if (window.innerWidth <= 991) return 3;
      return 6;
    };

    const setWidth = () => {
      const visible = getVisibleItems();

      const gap = parseFloat(getComputedStyle(track).gap || '0');

      const width = (carousel.clientWidth - gap * (visible - 1)) / visible;

      slides.forEach((slide) => {
        slide.style.flex = `0 0 ${width}px`;
      });

      return width;
    };

    const move = () => {
      const visible = getVisibleItems();

      const maxIndex = Math.max(0, slides.length - visible);

      this.currentIndex =
        this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;

      const gap = parseFloat(getComputedStyle(track).gap || '0');

      const width = slides[0]?.getBoundingClientRect().width || 0;

      track.style.transform = `translateX(-${this.currentIndex * (width + gap)}px)`;
    };

    const start = () => {
      clearInterval(this.timer);
      this.timer = setInterval(move, 2200);
    };

    const reset = () => {
      this.currentIndex = 0;
      setWidth();
      track.style.transform = 'translateX(0)';
      start();
    };

    setWidth();
    start();

    window.addEventListener('resize', reset);

    carousel.addEventListener('mouseenter', () => {
      clearInterval(this.timer);
    });

    carousel.addEventListener('mouseleave', () => {
      start();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
