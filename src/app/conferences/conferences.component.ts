import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-conferences',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './conferences.component.html',
  styleUrl: './conferences.component.css',
})
export class ConferencesComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getconferencesMeta().subscribe({
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
            content: metaData.Title || 'Conferences – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Explore national and international conferences hosted by Amity University Noida, covering research, innovation, and academic excellence.',
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
            content: 'Conferences – Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'Conferences – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Explore national and international conferences hosted by Amity University Noida, covering research, innovation, and academic excellence.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/img/update1/hero/slider-1.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Conferences – Amity University Noida',
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/conferences`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: metaData.Title || 'Conferences – Amity University Noida',
          description:
            metaData.Description ||
            'Explore national and international conferences hosted by Amity University Noida, covering research, innovation, and academic excellence.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
          mainEntity: {
            '@id': `${pageUrl}#conferences-list`,
          },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#conferences-list`,
          name: 'Conference List',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: { '@id': `${pageUrl}#event-ai-summit` },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: { '@id': `${pageUrl}#event-global-research-forum` },
            },
          ],
        },

        {
          '@type': 'Event',
          '@id': `${pageUrl}#event-ai-summit`,
          name: 'AI Research Summit 2025',
          description:
            'A national-level conference focusing on Artificial Intelligence, Robotics, and Machine Learning innovations.',
          startDate: '2025-03-10',
          endDate: '2025-03-12',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: 'Amity University Noida',
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

        {
          '@type': 'Event',
          '@id': `${pageUrl}#event-global-research-forum`,
          name: 'Global Research Forum 2025',
          description:
            'An international conference bringing together top researchers across multidisciplinary fields.',
          startDate: '2025-04-18',
          endDate: '2025-04-20',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: 'Amity University Noida',
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

        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          logo: {
            '@type': 'ImageObject',
            url: 'https://noida.amity.edu/assets/images/amity-logo.png',
          },
          foundingDate: '2005',
          description:
            'Amity University Noida conducts diverse research conferences and academic events across various fields.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201313',
            addressCountry: 'IN',
          },
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
              name: 'Conferences',
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
