import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-campus-events',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './campus-events.component.html',
  styleUrl: './campus-events.component.css',
})
export class CampusEventsComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getcampusEventsMeta().subscribe({
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
            content: metaData.Title || 'Campus Events – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Explore all upcoming and past campus events, seminars, fests, workshops, and conferences at Amity University Noida.',
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
            content: 'Campus Events – Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'Campus Events – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Explore all upcoming and past campus events, seminars, fests, workshops, and conferences at Amity University Noida.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Campus Events – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          // Define and set the canonical URL
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/campus-events`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': pageUrl,
          url: pageUrl,
          name: metaData.Title || 'Campus Events – Amity University Noida',
          description:
            metaData.Description ||
            'Explore all upcoming and past campus events, seminars, fests, workshops, and conferences at Amity University Noida.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#itemlist`,
          name: 'Campus Events List',
          itemListOrder: 'https://schema.org/ItemListOrderDescending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'Event',
                '@id': `${pageUrl}/amity-youth-fest`,
                name: 'Amity Youth Fest 2025',
                startDate: '2025-02-15',
                endDate: '2025-02-17',
                eventStatus: 'https://schema.org/EventScheduled',
                description:
                  'A 3-day cultural, technical and literary festival with competitions, concerts and workshops.',
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
              },
            },

            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'Event',
                '@id': `${pageUrl}/research-conclave`,
                name: 'Annual Research Conclave 2025',
                startDate: '2025-03-10',
                endDate: '2025-03-12',
                eventStatus: 'https://schema.org/EventScheduled',
                description:
                  'A platform showcasing innovative research presentations, poster sessions, and expert talks.',
                location: {
                  '@type': 'Place',
                  name: 'Amity Auditorium',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Noida',
                    addressRegion: 'Uttar Pradesh',
                    addressCountry: 'IN',
                  },
                },
              },
            },
          ],
        },

        {
          '@type': 'CollegeOrUniversity',
          '@id': `${baseUrl}/#college`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          description:
            'Amity University Noida is a leading educational institution offering world-class infrastructure, innovative programs, and holistic development.',
          logo: 'https://noida.amity.edu/path-to-logo.png',
          foundingDate: '2005',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201301',
            addressCountry: 'India',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '0120-2445252',
            contactType: 'customer service',
          },
          sameAs: [
            'https://www.facebook.com/...',
            'https://www.instagram.com/...',
            'https://www.linkedin.com/...',
            'https://twitter.com/...',
          ],
        },

        {
          '@type': 'EducationalOrganization',
          '@id': `${baseUrl}/#eduorg`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
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
              name: 'Campus Events',
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
            '@id': `${baseUrl}/#college`,
          },
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
}
