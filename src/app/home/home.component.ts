import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
declare var bootstrap: any; // Declare bootstrap globally
declare var gtag: any; // Declare gtag for Google Analytics

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Fixed incorrect `styleUrl` to `styleUrls`
})
export class HomeComponent implements AfterViewInit, OnInit {
  eventsData: any[] = [];
  AlumniTestimonials: any[] = [];
  homePageMeta: any[] = [];

  lastDateText: string = '';
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  targetDate!: Date;
  showPopup = true;

  showVirtualGuidance = true;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.getHomeAlumniTestimonials();
    this.updateMetaTags();

    this.getLastDate();

    // Hide after 18 July 2026 (11:59:59 PM)
    const expiryDate = new Date('2026-07-18T23:59:59');
    this.showVirtualGuidance = new Date() <= expiryDate;

    setTimeout(() => {
      this.showPopup = false;
    }, 10000);

    // Fetch events data
    this.apiService.getHomePageEvents().subscribe({
      next: (data: any) => {
        this.eventsData = data.slice(0, 3);
      },
      error: (err: any) => {
        console.error('Error fetching events data', err);
      },
    });
  }

  getLastDate(): void {
    const currentUrl = window.location.href.split('?')[0];

    this.apiService.getLastDateToApply().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          const matched = res.find(
            (item: any) =>
              item.PageUrl?.toLowerCase() === currentUrl.toLowerCase(),
          );

          if (matched) {
            this.lastDateText = matched.LastDate;

            // Extract date from text
            const dateMatch = matched.LastDate.match(
              /(\d{1,2})(st|nd|rd|th)?\s(\w+)\s(\d{4})/,
            );

            if (dateMatch) {
              const day = dateMatch[1];
              const month = dateMatch[3];
              const year = dateMatch[4];

              this.targetDate = new Date(`${month} ${day}, ${year} 23:59:59`);

              this.startCountdown();
            }
          }
        }
      },

      error: (err: any) => {
        console.log(err);
      },
    });
  }

  startCountdown(): void {
    setInterval(() => {
      const now = new Date().getTime();

      const distance = this.targetDate.getTime() - now;

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));

      this.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
      }
    }, 1000);
  }

  // Method to track Apply Now button clicks
  onHomeApplyClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Apply now button home page banner');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Home Apply Now',
        placeholder: 'Apply now button home page banner',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Apply now button home page banner',
        eventCategory: 'CTA Click',
        eventAction: 'Apply Now Click',
        eventLabel: 'Home',
      });
    }
  }

  // Admission Click Tracking
  onAdmissionApplyClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Apply for Admission Section');

    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Apply for Admission',
        placeholder: 'Apply for Admission Section',
        value: 1,
      });
    }

    // GTM DataLayer
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Apply for Admission Section',
        eventCategory: 'CTA Click',
        eventAction: 'Admission Apply Click',
        eventLabel: 'Home',
      });
    }
  }

  // Scholarship Click Tracking
  onScholarshipApplyClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Apply for Scholarship Section');

    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Apply for Scholarship',
        placeholder: 'Apply for Scholarship Section',
        value: 1,
      });
    }

    // GTM DataLayer
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Apply for Scholarship Section',
        eventCategory: 'CTA Click',
        eventAction: 'Scholarship Apply Click',
        eventLabel: 'Home',
      });
    }
  }

  // Method to track Apply Now button clicks
  onReadClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Read More Button home page');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Read More Now',
        placeholder: 'Read More Button home page',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Read More Button home page',
        eventCategory: 'CTA Click',
        eventAction: 'Read More Click',
        eventLabel: 'Home',
      });
    }
  }

  // Method to track Apply Now button clicks
  onClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Explore Program button home page banner');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Home Explore Program',
        placeholder: 'Explore Program button home page banner',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Explore Program button home page banner',
        eventCategory: 'CTA Click',
        eventAction: 'Home Explore Program',
        eventLabel: 'Home',
      });
    }
  }

  // Method to track Apply Now button clicks
  onUGExploreClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Explore More home page - UG');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'UGExplore Now',
        placeholder: 'Explore More home page - UG',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Explore More home page - UG',
        eventCategory: 'CTA Click',
        eventAction: 'UGExplore Click',
        eventLabel: 'Home',
      });
    }
  }

  // Method to track Apply Now button clicks
  onPGExploreClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Explore More home page - PG');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'PGExplore Now',
        placeholder: 'Explore More home page - PG',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Explore More home page - PG',
        eventCategory: 'CTA Click',
        eventAction: 'PGExplore Click',
        eventLabel: 'Home',
      });
    }
  }

  // Method to track Apply Now button clicks
  onPhdExploreClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Explore More home page - PHD');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'PhdExplore Now',
        placeholder: 'Explore More home page - PHD',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Explore More home page - PHD',
        eventCategory: 'CTA Click',
        eventAction: 'PhdExplore Click',
        eventLabel: 'Home',
      });
    }
  }

  // Method to track Apply Now button clicks
  onClickHere(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Click Here home page');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Click Here',
        placeholder: 'Click Here home page',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Click Here home page',
        eventCategory: 'CTA Click',
        eventAction: 'Click Here',
        eventLabel: 'Home',
      });
    }
  }

  // Method to track Apply Now button clicks
  onEventClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'View All Event Above Footer');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Click Event',
        placeholder: 'View All Event Above Footer',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'View All Event Above Footer',
        eventCategory: 'CTA Click',
        eventAction: 'Click Event',
        eventLabel: 'Home',
      });
    }
  }

  @ViewChildren('counter') counters!: QueryList<ElementRef>;

  updateMetaTags(): void {
    this.apiService.getHomePageMetas().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];

          // Update meta tags
          this.titleService.setTitle(metaData.Title || 'Default Title');
          this.meta.updateTag({
            name: 'description',
            content:
              metaData.Description || 'Default description for the homepage.',
          });
          this.meta.updateTag({
            name: 'keywords',
            content: metaData.Keywords || 'default, keywords',
          });

          // ================= Open Graph Meta Tags =================
          this.meta.updateTag({
            property: 'og:locale',
            content: 'en_IN',
          });

          this.meta.updateTag({
            property: 'og:type',
            content: 'website',
          });

          this.meta.updateTag({
            property: 'og:title',
            content:
              metaData.Title ||
              'Amity University Noida: Best Private University in Delhi NCR',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Apply to Amity University Noida, one of India’s leading universities, offering top UG & PG courses with global exposure, placements, scholarships, and industry-focused learning.',
          });

          this.meta.updateTag({
            property: 'og:url',
            content: metaData.CanonicalUrl || window.location.href,
          });

          this.meta.updateTag({
            property: 'og:site_name',
            content: 'Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:image',
            content:
              'https://noida.amity.edu/assets/img/update1/hero/slider-1.jpg',
          });

          this.meta.updateTag({
            property: 'og:image:alt',
            content: 'Amity University Noida Campus',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content:
              metaData.Title ||
              'Amity University Noida: Best Private University in Delhi NCR',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Apply to Amity University Noida, one of India’s leading universities, offering top UG & PG courses with global exposure, placements, scholarships, and industry-focused learning.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/img/update1/hero/slider-1.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Amity University Noida Campus',
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
          this.setCanonicalLink(canonicalUrl);

          // Call function to inject structured schema
          this.injectStructuredData(metaData);
        } else {
          console.warn('No meta data received or array is empty.');
        }
      },
      error: (error: any) => {
        console.error('Error fetching meta data from API:', error);
        this.setCanonicalLink(window.location.href);
      },
    });
  }

  injectStructuredData(metaData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': pageUrl,
          url: pageUrl,
          name: metaData.Title || 'Amity University Noida – Home',
          description:
            metaData.Description ||
            'Welcome to the official website of Amity University Noida, offering world-class education across undergraduate, postgraduate, and doctoral programs.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          breadcrumb: { '@id': `${baseUrl}/#breadcrumb-home` },
        },

        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: 'Amity University Noida',
          publisher: { '@id': `${baseUrl}/#university` },
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
        },

        {
          '@type': [
            'CollegeOrUniversity',
            'EducationalOrganization',
            'Organization',
          ],
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          foundingDate: '2005',
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
          description:
            "Amity University Noida is one of India's leading private universities offering high-quality education across a wide range of disciplines.",
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201313',
            addressCountry: 'IN',
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '0120-2445252',
              email: 'info@amity.edu',
              contactType: 'customer service',
              areaServed: 'IN',
            },
          ],
          sameAs: [
            'https://www.facebook.com/amityuni',
            'https://twitter.com/AmityUni',
            'https://www.instagram.com/amityuniversity/',
            'https://www.linkedin.com/school/amity-university/',
          ],
        },

        {
          '@type': 'BreadcrumbList',
          '@id': `${baseUrl}/#breadcrumb-home`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${baseUrl}/`,
            },
          ],
        },
      ],
    };

    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
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

  getHomeAlumniTestimonials() {
    this.apiService.getAlumniTestimonials().subscribe({
      next: (data: any) => {
        this.AlumniTestimonials = data.slice(0, 5);
      },
      error: (err: any) => {
        console.log('Error fetching testimonials', err);
      },
    });
  }

  trackByEventId(index: number, item: any): number {
    return item.iEventId;
  }

  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters
      .replace(/-+/g, '-') // Collapse consecutive hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  ngAfterViewInit(): void {
    this.initCounter();

    // Bootstrap Carousel
    const carouselElement = document.getElementById('myCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 10000,
        ride: 'carousel',
      });
    }

    const studentCarousel = document.getElementById('studentCarousel');
    if (studentCarousel) {
      new bootstrap.Carousel(studentCarousel, {
        interval: 5000,
        ride: 'carousel',
      });
    }
  }

  initCounter(): void {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;

            // Prevent multiple runs
            if (!element.classList.contains('counted')) {
              element.classList.add('counted');
              this.animateCounter(element);
            }

            obs.unobserve(element);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    this.counters.forEach((counter: ElementRef) => {
      observer.observe(counter.nativeElement);
    });
  }

  animateCounter(element: HTMLElement): void {
    const target = +element.getAttribute('data-target')!;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const current = Math.floor(progress * target);

      element.innerText = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.innerText = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.startCounter();
  //   }, 1000);

  //   // Ensure the DOM is loaded
  //   const carouselElement = document.getElementById('myCarousel');
  //   if (carouselElement) {
  //     const carousel = new bootstrap.Carousel(carouselElement, {
  //       interval: 10000, // Set auto-slide interval in milliseconds
  //       ride: 'carousel', // Starts the auto-slide
  //     });
  //   }

  //   // Ensure the DOM is loaded
  //   const carouseStudentlElement = document.getElementById('studentCarousel');
  //   if (carouseStudentlElement) {
  //     const carousel = new bootstrap.Carousel(carouseStudentlElement, {
  //       interval: 5000, // Set auto-slide interval in milliseconds
  //       ride: 'carousel', // Starts the auto-slide
  //     });
  //   }
  // }

  startCounter() {
    this.counters.forEach((counter: ElementRef) => {
      const element = counter.nativeElement;
      const target = +element.getAttribute('data-target');
      let current = 0;
      const increment = target / 200;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          element.innerText = target;
        }
      };

      updateCounter();
    });
  }
}
