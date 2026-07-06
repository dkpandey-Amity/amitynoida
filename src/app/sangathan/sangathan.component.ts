import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-sangathan',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sangathan.component.html',
  styleUrl: './sangathan.component.css',
})
export class SangathanComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getSangathanMeta().subscribe({
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

          const title = metaData.Title || 'Sangathan – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore Sangathan, the annual sports and cultural festival of Amity University Noida featuring competitions, athletic events, ceremonies, and student celebrations.';

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
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/sangathan`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= SANGATHAN PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name:
            metaData.Title || 'Sangathan – Annual Sports & Cultural Festival',
          description:
            metaData.Description ||
            'Explore Sangathan, the annual sports and cultural festival of Amity University Noida featuring competitions, athletic events, ceremonies, and celebrations across campuses.',
          isPartOf: {
            '@id': `${baseUrl}#university`,
          },
          mainEntity: {
            '@id': `${canonicalUrl}#sangathan-events-list`,
          },
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb`,
          },
        },

        /* ================= EVENTS LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#sangathan-events-list`,
          name: 'Sangathan Events',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: { '@id': `${canonicalUrl}#event-opening` },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: { '@id': `${canonicalUrl}#event-athletics` },
            },
          ],
        },

        /* ================= EVENT 1 ================= */
        {
          '@type': 'Event',
          '@id': `${canonicalUrl}#event-opening`,
          name: 'Sangathan Opening Ceremony',
          description:
            'The grand opening ceremony of Sangathan featuring parade, performances, and inter-campus flag hoisting.',
          startDate: '2024-10-01T09:00',
          endDate: '2024-10-01T12:00',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: {
            '@type': 'Place',
            name: 'Amity University Noida Sports Grounds',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sector 125',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201313',
              addressCountry: 'IN',
            },
          },
          organizer: { '@id': `${baseUrl}#university` },
        },

        /* ================= EVENT 2 ================= */
        {
          '@type': 'Event',
          '@id': `${canonicalUrl}#event-athletics`,
          name: 'Inter-Campus Athletics Competition',
          description:
            'Track and field competitions between various Amity University campuses.',
          startDate: '2024-10-05T08:00',
          endDate: '2024-10-05T17:00',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: {
            '@type': 'Place',
            name: 'Amity University Noida Athletics Track',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sector 125',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201313',
              addressCountry: 'IN',
            },
          },
          organizer: { '@id': `${baseUrl}#university` },
        },

        /* ================= UNIVERSITY ================= */
        {
          '@type': [
            'CollegeOrUniversity',
            'EducationalOrganization',
            'Organization',
          ],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          foundingDate: '2005',
          description:
            'Amity University Noida hosts Sangathan, an annual sports and cultural celebration promoting teamwork, fitness, and student engagement across all campuses.',
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
              email: 'sports@amity.edu',
              contactType: 'sports coordination',
              areaServed: 'Worldwide',
            },
            {
              '@type': 'ContactPoint',
              telephone: '0120-4713600',
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
              name: 'Sangathan',
              item: canonicalUrl,
            },
          ],
        },
      ],
    };

    // Remove old schema
    const existingScript = document.getElementById('structured-data');
    if (existingScript) existingScript.remove();

    // Inject schema
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
