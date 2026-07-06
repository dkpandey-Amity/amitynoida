import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-global-campuses',
  standalone: true,
  imports: [],
  templateUrl: './global-campuses.component.html',
  styleUrl: './global-campuses.component.css'
})
export class GlobalCampusesComponent {

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getGlobalCampusesMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];

          // ================= BASIC META =================
          this.titleService.setTitle(
            metaData.Title || 'Global Campuses – Amity University Noida',
          );

          this.meta.updateTag({
            name: 'description',
            content: metaData.Description || 'Explore Amity University global campuses across India, London, Dubai, Singapore, New York, and more. Discover world-class education opportunities worldwide.'
          });

          this.meta.updateTag({
            name: 'keywords',
            content: metaData.Keywords || 'Amity global campuses, Amity international campuses, Amity University locations, Amity abroad, Amity world campuses'
          });

          // ================= CANONICAL =================
          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
          this.setCanonicalLink(canonicalUrl);

          // ================= OG + TWITTER =================
          const pageUrl = canonicalUrl;

          const title = metaData.Title || 'Global Campuses – Amity University Noida';

          const description = metaData.Description || 'Explore Amity University global campuses across India, London, Dubai, Singapore, New York, and more. Discover world-class education opportunities worldwide.';

          const imageUrl = 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          // ===== Open Graph =====
          this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
          this.meta.updateTag({ property: 'og:type', content: 'website' });
          this.meta.updateTag({ property: 'og:title', content: title });
          this.meta.updateTag({ property: 'og:description', content: description });
          this.meta.updateTag({ property: 'og:url', content: pageUrl });
          this.meta.updateTag({ property: 'og:site_name', content: 'Amity University Noida' });
          this.meta.updateTag({ property: 'og:image', content: imageUrl });
          this.meta.updateTag({ property: 'og:image:alt', content: title });

          // ===== Twitter =====
          this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
          this.meta.updateTag({ name: 'twitter:title', content: title });
          this.meta.updateTag({ name: 'twitter:description', content: description });
          this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
          this.meta.updateTag({ name: 'twitter:image:alt', content: title });
          this.meta.updateTag({ name: 'twitter:site', content: '@AmityUni' });
          this.meta.updateTag({ name: 'twitter:creator', content: '@AmityUni' });

          // ================= SCHEMA =================
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
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/global-campuses`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        // ================= PAGE =================
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Global Campuses – Amity University Noida',
          description: metaData.Description || 'Explore Amity University global campuses across India, London, Dubai, Singapore, New York, and more.',
          isPartOf: { '@id': `${baseUrl}#university` },
          mainEntity: { '@id': `${canonicalUrl}#campus-list` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb-global-campuses` },
        },

        // ================= CAMPUS LIST =================
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#campus-list`,
          name: 'Global Campuses',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: { '@id': `${canonicalUrl}#campus-noida` },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: { '@id': `${canonicalUrl}#campus-london` },
            },
            {
              '@type': 'ListItem',
              position: 3,
              item: { '@id': `${canonicalUrl}#campus-dubai` },
            },
            {
              '@type': 'ListItem',
              position: 4,
              item: { '@id': `${canonicalUrl}#campus-singapore` },
            },
            {
              '@type': 'ListItem',
              position: 5,
              item: { '@id': `${canonicalUrl}#campus-newyork` },
            },
          ],
        },

        // ================= CAMPUS NOIDA =================
        {
          '@type': 'CollegeOrUniversity',
          '@id': `${canonicalUrl}#campus-noida`,
          name: 'Amity University Noida',
          description: 'Main campus in Noida, Uttar Pradesh, India offering undergraduate, postgraduate, and doctoral programs.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201313',
            addressCountry: 'IN',
          },
          url: 'https://noida.amity.edu',
        },

        // ================= CAMPUS LONDON =================
        {
          '@type': 'CollegeOrUniversity',
          '@id': `${canonicalUrl}#campus-london`,
          name: 'Amity University London',
          description: 'UK campus offering world-class education in the heart of London.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'London',
            addressCountry: 'UK',
          },
          url: 'https://amity.edu/london',
        },

        // ================= CAMPUS DUBAI =================
        {
          '@type': 'CollegeOrUniversity',
          '@id': `${canonicalUrl}#campus-dubai`,
          name: 'Amity University Dubai',
          description: 'UAE campus located in Dubai International Academic City.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'UAE',
          },
          url: 'https://amity.edu/dubai',
        },

        // ================= CAMPUS SINGAPORE =================
        {
          '@type': 'CollegeOrUniversity',
          '@id': `${canonicalUrl}#campus-singapore`,
          name: 'Amity University Singapore',
          description: 'Asian hub for global education in Singapore.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Singapore',
            addressCountry: 'SG',
          },
          url: 'https://amity.edu/singapore',
        },

        // ================= CAMPUS NEW YORK =================
        {
          '@type': 'CollegeOrUniversity',
          '@id': `${canonicalUrl}#campus-newyork`,
          name: 'Amity University New York',
          description: 'North American campus located in New York City.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'New York',
            addressCountry: 'USA',
          },
          url: 'https://amity.edu/newyork',
        },

        // ================= UNIVERSITY =================
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization', 'Organization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          foundingDate: '2005',
          description: 'Amity University Noida is a leading private university in India with global campuses across the world.',
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

        // ================= BREADCRUMB =================
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb-global-campuses`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: baseUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Global Campuses',
              item: canonicalUrl,
            },
          ],
        },
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