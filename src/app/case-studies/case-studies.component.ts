import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-case-studies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './case-studies.component.html',
  styleUrl: './case-studies.component.css',
})
export class CaseStudiesComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getCaseStudiesMeta().subscribe({
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
            content: metaData.Title || 'Case Studies – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Explore real-world case studies authored by Amity University faculty and students across diverse disciplines.',
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
            content: 'Case Studies – Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'Case Studies – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Explore real-world case studies authored by Amity University faculty and students across diverse disciplines.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Case Studies – Amity University Noida',
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/case-studies`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: metaData.Title || 'Case Studies – Amity University Noida',
          description:
            metaData.Description ||
            'Explore real-world case studies authored by Amity University faculty and students across diverse disciplines.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
          mainEntity: {
            '@id': `${pageUrl}#case-study-list`,
          },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#case-study-list`,
          name: 'Case Studies – Amity University Noida',
          description:
            'Collection of research-based and industry-focused case studies.',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: 2,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'CreativeWork',
                '@id': `${pageUrl}/case-1`,
                name: 'AI-Driven Optimization in Retail Analytics',
                description:
                  'A case study exploring AI-powered insights to improve customer behavior forecasting.',
                url: `${pageUrl}/case-1`,
                author: 'Dr. Ananya Gupta',
                datePublished: '2024-03-12',
              },
            },

            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'CreativeWork',
                '@id': `${pageUrl}/case-2`,
                name: 'Sustainable Architecture for Smart Campuses',
                description:
                  'An innovative study on eco-friendly infrastructure and energy optimization.',
                url: `${pageUrl}/case-2`,
                author: 'Prof. Rohan Malhotra',
                datePublished: '2024-02-20',
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
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
          foundingDate: '2005',
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
              name: 'Case Studies',
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
