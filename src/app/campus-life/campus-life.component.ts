import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';


@Component({
  selector: 'app-campus-life',
  standalone: true,
  imports: [],
  templateUrl: './campus-life.component.html',
  styleUrls: ['./campus-life.component.css']
})
export class CampusLifeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('sportCarousel') sportCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('sportTrack') sportTrack!: ElementRef<HTMLDivElement>;

  private timer: any;
  private currentIndex = 0;

  ngAfterViewInit(): void {

    this.initSportsCarousel();

    // Marquee Init
    setTimeout(() => {

      if (
        typeof $ !== 'undefined' &&
        $.fn &&
        $('#marqueeLeft').length
      ) {


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

      const gap = parseFloat(
        getComputedStyle(track).gap || '0'
      );

      const width =
        (carousel.clientWidth - (gap * (visible - 1))) /
        visible;

      slides.forEach((slide) => {
        slide.style.flex = `0 0 ${width}px`;
      });

      return width;
    };

    const move = () => {

      const visible = getVisibleItems();

      const maxIndex = Math.max(
        0,
        slides.length - visible
      );

      this.currentIndex =
        this.currentIndex >= maxIndex
          ? 0
          : this.currentIndex + 1;

      const gap = parseFloat(
        getComputedStyle(track).gap || '0'
      );

      const width =
        slides[0]?.getBoundingClientRect().width || 0;

      track.style.transform =
        `translateX(-${this.currentIndex * (width + gap)}px)`;
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