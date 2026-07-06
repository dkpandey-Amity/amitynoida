import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

declare var gtag: any; // Declare gtag for Google Analytics

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  eventsAllData: any[] = [];
  paginatedEvents: any[] = [];

  currentPage: number = 1;
  pageSize: number = 12; // Number of events per page
  totalPages: number = 0;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.apiService.getAllEvents().subscribe((data: any) => {
      //console.log('API data:', data);
      this.eventsAllData = data || [];

      // Initialize pagination
      this.totalPages = Math.ceil(this.eventsAllData.length / this.pageSize);
      this.setPage(this.currentPage);
    });
  }

  // Method to track Apply Now button clicks
  oneEventExploreClick(eventName: string): void {
    //console.log('Event Triggered:', eventName);
    //console.log('Placeholder:', 'Event Page ( Explore More ) ');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Explore More',
        placeholder: 'Event Page ( Explore More ) ',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Event Page ( Explore More ) ',
        eventCategory: 'CTA Click',
        eventAction: 'Explore More',
        eventLabel: 'Events',
      });
    }
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages || this.totalPages === 0) {
      return;
    }
    this.currentPage = page;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEvents = this.eventsAllData.slice(startIndex, endIndex);
  }

  // Go to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  // Go to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  updateMetaTags(): void {
    this.apiService.getEventsMeta().subscribe({
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
            content: metaData.Title || 'Events – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Browse upcoming events, seminars, workshops, and activities at Amity University Noida.',
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
              'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            property: 'og:image:alt',
            content: 'Events – Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'Events – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Browse upcoming events, seminars, workshops, and activities at Amity University Noida.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Events – Amity University Noida',
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/events`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: metaData.Title || 'Events – Amity University Noida',
          description:
            metaData.Description ||
            'Browse upcoming events, seminars, workshops, and activities at Amity University Noida.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          mainEntity: {
            '@id': `${pageUrl}#events-list`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#events-list`,
          name: 'Upcoming Events',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: { '@id': `${pageUrl}#event-1` },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: { '@id': `${pageUrl}#event-2` },
            },
          ],
        },

        {
          '@type': 'Event',
          '@id': `${pageUrl}#event-1`,
          name: 'International Students Orientation',
          description:
            'Orientation program for new international students joining Amity University Noida.',
          startDate: '2025-02-10T10:00',
          endDate: '2025-02-10T15:00',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: 'Amity University Noida Campus',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sector 125',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201313',
              addressCountry: 'IN',
            },
          },
          organizer: {
            '@id': `${baseUrl}/#university`,
          },
        },

        {
          '@type': 'Event',
          '@id': `${pageUrl}#event-2`,
          name: 'Research & Innovation Conclave',
          description:
            'Annual research conclave featuring presentations and workshops.',
          startDate: '2025-03-15T09:00',
          endDate: '2025-03-15T17:00',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: 'Amity University Auditorium',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sector 125',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201313',
              addressCountry: 'IN',
            },
          },
          organizer: {
            '@id': `${baseUrl}/#university`,
          },
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
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
          foundingDate: '2005',
          description:
            'Amity University Noida is a leading private university offering quality education and hosting diverse academic and cultural events.',
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
              contactType: 'general inquiries',
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
          '@id': `${pageUrl}#breadcrumb`,
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
              name: 'Events',
              item: pageUrl,
            },
          ],
        },

        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: 'Amity University Noida',
          publisher: {
            '@id': `${baseUrl}/#university`,
          },
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
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

  // Method to format faculty name for routing by handling multiple spaces and special characters
  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim() // Trim leading and trailing spaces
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
