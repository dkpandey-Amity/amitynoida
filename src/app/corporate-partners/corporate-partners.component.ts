import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-corporate-partners',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './corporate-partners.component.html',
  styleUrl: './corporate-partners.component.css',
})
export class CorporatePartnersComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getcorporatePartnersMeta().subscribe({
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
            content:
              metaData.Title || 'Corporate Partners – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Explore leading corporate partners, recruiters, and industry collaborations of Amity University Noida.',
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
            content: 'Corporate Partners – Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content:
              metaData.Title || 'Corporate Partners – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Explore leading corporate partners, recruiters, and industry collaborations of Amity University Noida.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Corporate Partners – Amity University Noida',
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/corporate-partners`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: metaData.Title || 'Corporate Partners – Amity University Noida',
          description:
            metaData.Description ||
            'Explore leading corporate partners, recruiters, and industry collaborations of Amity University Noida.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          about: {
            '@id': `${baseUrl}/#university`,
          },
          mainEntity: {
            '@id': `${pageUrl}#corporate-partner-list`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#corporate-partner-list`,
          name: 'Corporate Partners of Amity University Noida',
          description:
            'List of leading corporate partners, recruiters, and industry collaborators.',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: 3,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'Organization',
                name: 'TCS',
                url: 'https://www.tcs.com',
                description:
                  'Top recruiter offering placements and internships.',
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'Organization',
                name: 'Deloitte',
                url: 'https://www2.deloitte.com',
                description: 'Global consulting leader partnering with Amity.',
              },
            },
            {
              '@type': 'ListItem',
              position: 3,
              item: {
                '@type': 'Organization',
                name: 'HCL Technologies',
                url: 'https://www.hcltech.com',
                description:
                  'Industry collaborator in technology and innovation.',
              },
            },
          ],
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
          logo: {
            '@type': 'ImageObject',
            url: 'https://noida.amity.edu/assets/images/amity-logo.png',
          },
          foundingDate: '2005',
          description:
            'Amity University Noida is a leading private university offering global-standard education and strong industry collaborations.',
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
              contactType: 'corporate relations',
              email: 'corporate@amity.edu',
              telephone: '0120-2445252',
              areaServed: 'IN',
            },
            {
              '@type': 'ContactPoint',
              contactType: 'general inquiries',
              email: 'info@amity.edu',
              telephone: '0120-4713600',
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
              name: 'Corporate Partners',
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
