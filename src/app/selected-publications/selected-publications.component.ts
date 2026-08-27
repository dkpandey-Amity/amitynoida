import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from '../service/noidaweb.service';

declare var bootstrap: any;

@Component({
  selector: 'app-selected-publications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-publications.component.html',
  styleUrl: './selected-publications.component.css',
})
export class SelectedPublicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  studentList: any[] = [];
  private carouselInstances: any[] = [];

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.getData();
    this.updateMetaTags();
  }

  ngAfterViewInit() {
    // Initialize carousels after view is ready
    this.initializeCarousels();
  }

  ngOnDestroy() {
    // Clean up carousel instances
    this.carouselInstances.forEach((carousel) => {
      if (carousel && carousel.dispose) {
        carousel.dispose();
      }
    });
    this.carouselInstances = [];
  }

  initializeCarousels() {
    // Wait for DOM to be fully rendered
    setTimeout(() => {
      // Initialize all carousels that are already visible
      document.querySelectorAll('.carousel').forEach((carouselEl: any) => {
        try {
          // Check if carousel is already initialized
          const existingInstance = bootstrap.Carousel.getInstance(carouselEl);
          if (!existingInstance) {
            const carousel = new bootstrap.Carousel(carouselEl, {
              interval: 3000,
              ride: 'carousel',
              pause: 'hover',
              wrap: true
            });
            this.carouselInstances.push(carousel);
          }
        } catch (error) {
          console.warn('Error initializing carousel:', error);
        }
      });
    }, 100);
  }

  // Call this method after data is loaded
  reinitializeCarousels() {
    setTimeout(() => {
      // Dispose existing carousels
      this.carouselInstances.forEach((carousel) => {
        if (carousel && carousel.dispose) {
          carousel.dispose();
        }
      });
      this.carouselInstances = [];

      // Reinitialize all carousels
      document.querySelectorAll('.carousel').forEach((carouselEl: any) => {
        try {
          const carousel = new bootstrap.Carousel(carouselEl, {
            interval: 3000,
            ride: 'carousel',
            pause: 'hover',
            wrap: true
          });
          this.carouselInstances.push(carousel);
        } catch (error) {
          console.warn('Error reinitializing carousel:', error);
        }
      });
    }, 500);
  }

  getData() {
    this.apiService.GetAcaiselectedpublications().subscribe({
      next: (res: any[]) => {
        const baseUrl =
          'https://img.amizone.net/AzureFileHandler.ashx?FileName=amitywebsite/userfiles/ACAI2024/';

        this.studentList = (res || []).slice(0, 6).map((item) => ({
          ...item,
          ImagePath: item.ImagePath ? baseUrl + item.ImagePath : '',
          ImagePath2: item.ImagePath2 ? baseUrl + item.ImagePath2 : '',
          ImagePath3: item.ImagePath3 ? baseUrl + item.ImagePath3 : '',
          Facult_ImagePath: item.Facult_ImagePath
            ? baseUrl + item.Facult_ImagePath
            : '',
          Facult_ImagePath2: item.Facult_ImagePath2
            ? baseUrl + item.Facult_ImagePath2
            : '',
          Facult_ImagePath3: item.Facult_ImagePath3
            ? baseUrl + item.Facult_ImagePath3
            : '',
          Facult_ImagePath4: item.Facult_ImagePath4
            ? baseUrl + item.Facult_ImagePath4
            : '',
          Facult_ImagePath5: item.Facult_ImagePath5
            ? baseUrl + item.Facult_ImagePath5
            : '',
          PublisherIconPath: item.PublisherIconPath
            ? baseUrl + item.PublisherIconPath
            : '',
          CollaboratorIconPath: item.CollaboratorIconPath
            ? baseUrl + item.CollaboratorIconPath
            : '',
          CollaboratorIconPath2: item.CollaboratorIconPath2
            ? baseUrl + item.CollaboratorIconPath2
            : '',
          CollaboratorIconPath3: item.CollaboratorIconPath3
            ? baseUrl + item.CollaboratorIconPath3
            : '',
        }));

        // Reinitialize carousels after data is loaded
        this.reinitializeCarousels();
      },
      error: (err) => console.error(err),
    });
  }

  // Alternative: Initialize carousels when modal is shown
  setupModalListeners() {
    document.querySelectorAll('.modal').forEach((modal: any) => {
      modal.addEventListener('shown.bs.modal', () => {
        modal.querySelectorAll('.carousel').forEach((carouselEl: any) => {
          try {
            const existingInstance = bootstrap.Carousel.getInstance(carouselEl);
            if (!existingInstance) {
              const carousel = new bootstrap.Carousel(carouselEl, {
                interval: 3000,
                ride: 'carousel',
                pause: 'hover',
                wrap: true
              });
              this.carouselInstances.push(carousel);
            } else {
              // Restart existing carousel
              existingInstance.cycle();
            }
          } catch (error) {
            console.warn('Error initializing carousel in modal:', error);
          }
        });
      });

      modal.addEventListener('hidden.bs.modal', () => {
        modal.querySelectorAll('.carousel').forEach((carouselEl: any) => {
          try {
            const instance = bootstrap.Carousel.getInstance(carouselEl);
            if (instance) {
              instance.pause();
            }
          } catch (error) {
            console.warn('Error pausing carousel:', error);
          }
        });
      });
    });
  }

  // Manual carousel control methods (if needed)
  slidePrev(sliderId: string) {
    const element = document.getElementById(sliderId);
    if (element) {
      const carousel = bootstrap.Carousel.getInstance(element);
      if (carousel) {
        carousel.prev();
      }
    }
  }

  slideNext(sliderId: string) {
    const element = document.getElementById(sliderId);
    if (element) {
      const carousel = bootstrap.Carousel.getInstance(element);
      if (carousel) {
        carousel.next();
      }
    }
  }

  // Rest of your existing methods...
  updateMetaTags(): void {
    // Your existing updateMetaTags implementation
    this.apiService.getAcaiNewSelectedInnovationsMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];
          this.titleService.setTitle(
            metaData.Title || 'Amity University, Noida',
          );
          this.meta.updateTag({
            name: 'description',
            content: metaData.Description || 'Amity University, Noida',
          });
          this.meta.updateTag({
            name: 'keywords',
            content: metaData.Keywords || 'Amity University, Noida',
          });

          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
          const pageUrl = canonicalUrl;
          const title =
            metaData.Title || 'Selected Publications – Amity University Noida';
          const description =
            metaData.Description ||
            'Explore Selected Publications at Amity University Noida including projects, startups, research ideas, and creative achievements by students.';
          const imageUrl =
            'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
          this.meta.updateTag({ property: 'og:type', content: 'website' });
          this.meta.updateTag({ property: 'og:title', content: title });
          this.meta.updateTag({ property: 'og:description', content: description });
          this.meta.updateTag({ property: 'og:url', content: pageUrl });
          this.meta.updateTag({ property: 'og:site_name', content: 'Amity University Noida' });
          this.meta.updateTag({ property: 'og:image', content: imageUrl });
          this.meta.updateTag({ property: 'og:image:alt', content: title });

          this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
          this.meta.updateTag({ name: 'twitter:title', content: title });
          this.meta.updateTag({ name: 'twitter:description', content: description });
          this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
          this.meta.updateTag({ name: 'twitter:image:alt', content: title });
          this.meta.updateTag({ name: 'twitter:site', content: '@AmityUni' });
          this.meta.updateTag({ name: 'twitter:creator', content: '@AmityUni' });

          this.setCanonicalLink(canonicalUrl);
          this.injectStructuredData(metaData);

          // Setup modal listeners after meta data is loaded
          this.setupModalListeners();
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
    // Your existing injectStructuredData implementation
    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/student-clubs`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Selected Publications – Amity University Noida',
          description: metaData.Description || 'Explore student clubs at Amity University Noida including cultural, technical, sports, social, and innovation-driven student communities.',
          isPartOf: { '@id': `${baseUrl}#university` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
          mainEntity: { '@id': `${canonicalUrl}#clubs-list` },
        },
        // ... rest of your schema
      ],
    };

    const existingScript = document.getElementById('structured-data');
    if (existingScript) existingScript.remove();

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
}