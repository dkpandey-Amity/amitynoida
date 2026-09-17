import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-amimun',
  standalone: true,
  imports: [],
  templateUrl: './amimun.component.html',
  styleUrl: './amimun.component.css',
})
export class AmimunComponent implements OnInit {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getamimunMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];

          /* ================= TITLE ================= */

          this.titleService.setTitle(
            metaData.Title ||
              'AMIMUN ’27 | From Wisdom to Action | Amity University Noida',
          );

          /* ================= BASIC META TAGS ================= */

          this.meta.updateTag({
            name: 'description',
            content:
              metaData.Description ||
              'AMIMUN ’27 – The 16th Edition of Amity International Model United Nations at Amity University, Uttar Pradesh.',
          });

          this.meta.updateTag({
            name: 'keywords',
            content:
              metaData.Keywords ||
              'AMIMUN 2027, AMIMUN ’27, Amity International Model United Nations, Model United Nations, Amity University Noida',
          });

          /* ================= OPEN GRAPH ================= */

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
            content: metaData.Title || 'AMIMUN ’27 | From Wisdom to Action',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'The 16th Edition of Amity International Model United Nations at Amity University, Uttar Pradesh.',
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
            content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            property: 'og:image:alt',
            content: 'AMIMUN ’27 – Amity International Model United Nations',
          });

          /* ================= TWITTER / X ================= */

          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'AMIMUN ’27 | From Wisdom to Action',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'The 16th Edition of Amity International Model United Nations at Amity University, Uttar Pradesh.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'AMIMUN ’27 – Amity International Model United Nations',
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          /* ================= CANONICAL ================= */

          const canonicalUrl = metaData.CanonicalUrl || window.location.href;

          this.setCanonicalLink(canonicalUrl);

          /* ================= STRUCTURED DATA ================= */

          this.injectStructuredData(metaData);
        } else {
          console.warn('No AMIMUN meta data received or array is empty.');
        }
      },

      error: (error: any) => {
        console.error('Error fetching AMIMUN meta data from API:', error);

        this.setCanonicalLink(window.location.href);
      },
    });
  }

  /* =========================================================
     STRUCTURED DATA
  ========================================================= */

  injectStructuredData(metaData: any): void {
    const baseUrl = 'https://noida.amity.edu';

    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/amimun`;

    const schema = {
      '@context': 'https://schema.org',

      '@graph': [
        {
          '@type': ['WebPage', 'Event'],

          '@id': pageUrl,

          url: pageUrl,

          name: metaData.Title || 'AMIMUN ’27 | From Wisdom to Action',

          description:
            metaData.Description ||
            'The 16th Edition of Amity International Model United Nations at Amity University, Uttar Pradesh.',

          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },

          startDate: '2027-01-15',

          endDate: '2027-01-17',

          eventStatus: 'https://schema.org/EventScheduled',

          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',

          location: {
            '@type': 'Place',

            name: 'Amity University, Uttar Pradesh',

            address: {
              '@type': 'PostalAddress',

              addressLocality: 'Noida',

              addressRegion: 'Uttar Pradesh',

              postalCode: '201301',

              addressCountry: 'IN',
            },
          },

          organizer: {
            '@type': 'Organization',

            name: 'Amity University Noida',

            url: `${baseUrl}/`,
          },
        },

        /* ================= UNIVERSITY ================= */

        {
          '@type': [
            'CollegeOrUniversity',
            'EducationalOrganization',
            'Organization',
          ],

          '@id': `${baseUrl}/#college`,

          name: 'Amity University Noida',

          url: `${baseUrl}/`,

          logo: 'https://noida.amity.edu/assets/images/logo.png',

          foundingDate: '2005',

          address: {
            '@type': 'PostalAddress',

            streetAddress: 'Amity Campus, Sector 125',

            addressLocality: 'Noida',

            addressRegion: 'Uttar Pradesh',

            postalCode: '201301',

            addressCountry: 'IN',
          },
        },

        /* ================= BREADCRUMB ================= */

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

              name: 'AMIMUN ’27',

              item: pageUrl,
            },
          ],
        },

        /* ================= WEBSITE ================= */

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

    /* Remove existing schema */

    const existingScript = document.getElementById('amimun-structured-data');

    if (existingScript) {
      existingScript.remove();
    }

    /* Add schema */

    const script = document.createElement('script');

    script.type = 'application/ld+json';

    script.id = 'amimun-structured-data';

    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  /* =========================================================
     CANONICAL
  ========================================================= */

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
