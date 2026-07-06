import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-placement-statistics',
  standalone: true,
  imports: [],
  templateUrl: './placement-statistics.component.html',
  styleUrl: './placement-statistics.component.css',
})
export class PlacementStatisticsComponent implements AfterViewInit {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }
  @ViewChildren('marquee')
  marquees!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.marquees.forEach((marquee) => {
      this.initMarquee(marquee.nativeElement);
    });
  }

  private startMarquee(container: HTMLElement, list: HTMLElement): any {
    return setInterval(() => {
      container.scrollLeft += 1;

      if (container.scrollLeft >= list.scrollWidth) {
        container.scrollLeft = 0;
      }
    }, 20);
  }

  initMarquee(container: HTMLElement): void {
    const list = container.querySelector('ul') as HTMLElement;

    if (!list) return;

    let interval = this.startMarquee(container, list);

    container.addEventListener('mouseenter', () => {
      clearInterval(interval);
    });

    container.addEventListener('mouseleave', () => {
      interval = this.startMarquee(container, list);
    });
  }

  scrollToTarget(targetId: string): void {
    const element = document.querySelector(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  showScrollTop = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.pageYOffset > 100;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  updateMetaTags(): void {
    this.apiService.getPlacementStatisticsMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Assuming you want to use the first item in the array
          const metaData = data[0];

          // Update meta tags dynamically after data is fetched
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

          // Define and set the canonical URL
          const canonicalUrl = metaData.CanonicalUrl || window.location.href;

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = canonicalUrl;

          const title =
            metaData.Title || 'Placement Statistics – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore placement statistics at Amity University Noida including highest packages, average salary, recruiters, and placement performance.';

          const imageUrl =
            'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          // ================= Open Graph =================
          this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

          this.meta.updateTag({ property: 'og:type', content: 'website' });

          this.meta.updateTag({
            property: 'og:title',
            content: title,
          });

          this.meta.updateTag({
            property: 'og:description',
            content: description,
          });

          this.meta.updateTag({
            property: 'og:url',
            content: pageUrl,
          });

          this.meta.updateTag({
            property: 'og:site_name',
            content: 'Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:image',
            content: imageUrl,
          });

          this.meta.updateTag({
            property: 'og:image:alt',
            content: title,
          });

          // ================= Twitter =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: title,
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content: description,
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content: imageUrl,
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: title,
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

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
    const canonicalUrl = metaData.CanonicalUrl || window.location.href;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= WEBPAGE ================= */
        {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name:
            metaData.Title || 'Placement Statistics – Amity University Noida',
          description: metaData.Description,
          isPartOf: {
            '@id': `${baseUrl}#website`,
          },
          mainEntity: {
            '@id': `${canonicalUrl}#placement-dataset`,
          },
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb`,
          },
        },

        /* ================= DATASET ================= */
        {
          '@type': 'Dataset',
          '@id': `${canonicalUrl}#placement-dataset`,
          name: 'Amity University Noida Placement Statistics',
          description:
            'Annual placement data covering salary packages, recruiter participation, and placement outcomes.',
          url: canonicalUrl,
          creator: {
            '@id': `${baseUrl}#university`,
          },
          publisher: {
            '@id': `${baseUrl}#university`,
          },
          keywords: [
            'placement statistics',
            'campus placements',
            'highest package',
            'average salary',
            'recruiters',
          ],
          variableMeasured: [
            'Highest Salary',
            'Average Salary',
            'Median Salary',
            'Number of Recruiters',
            'Placement Percentage',
          ],
          dateModified: metaData.LastUpdated || '2025-07-01',
        },

        /* ================= UNIVERSITY ================= */
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          foundingDate: '2005',
          description:
            'Amity University Noida is a leading private university offering multidisciplinary education and strong placement outcomes.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201301',
            addressCountry: 'IN',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-120-4392000',
            contactType: 'admissions',
            areaServed: 'IN',
          },
          sameAs: [
            'https://www.facebook.com/amityuni',
            'https://www.instagram.com/amityuniversity/',
            'https://www.linkedin.com/school/amity-university/',
            'https://twitter.com/AmityUni',
          ],
        },

        /* ================= BREADCRUMB ================= */
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${baseUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Placement Statistics',
              item: canonicalUrl,
            },
          ],
        },

        /* ================= WEBSITE ================= */
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          url: baseUrl,
          name: 'Amity University Noida',
          publisher: {
            '@id': `${baseUrl}#university`,
          },
        },
      ],
    };

    // Remove old schema
    const existingScript = document.getElementById('structured-data');
    if (existingScript) existingScript.remove();

    // Inject new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private setCanonicalLink(url: string): void {
    // Attempt to find an existing canonical link
    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]',
    );

    if (!link) {
      // If not found, create a new canonical link element
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    // Set the href attribute
    link.setAttribute('href', url);
  }
}
