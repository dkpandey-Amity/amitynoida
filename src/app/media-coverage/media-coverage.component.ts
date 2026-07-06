import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-media-coverage',
  standalone: true,
  imports: [],
  templateUrl: './media-coverage.component.html',
  styleUrl: './media-coverage.component.css',
})
export class MediaCoverageComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getMediaCoverageMeta().subscribe({
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

          // Prepare dynamic values
          const pageUrl = metaData.CanonicalUrl || window.location.href;

          const title =
            metaData.Title || 'Media Coverage – Amity University Noida';

          const description =
            metaData.Description ||
            'Press articles, scholarly mentions, and media features covering Amity University Noida.';

          const imageUrl = metaData.ImageUrl
            ? `https://noida.amity.edu/${metaData.ImageUrl}`
            : 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          // ================= Open Graph Meta Tags =================
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

          // ================= Twitter (X) Meta Tags =================
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/media-coverage`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': pageUrl,
          url: pageUrl,
          name: metaData.Title || 'Media Coverage',
          description:
            metaData.Description ||
            'Press articles, scholarly mentions, and media features covering Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#itemlist`,
          itemListOrder: 'Ascending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'Article',
                name: 'Amity University Noida Featured in National Education Review',
                url: `${baseUrl}/articles/national-education-review`,
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'ScholarlyArticle',
                name: 'Impact of Industry Partnerships on Student Success',
                url: `${baseUrl}/articles/industry-partnership-study`,
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
            'A leading private university offering globally benchmarked education across disciplines.',
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          foundingDate: '2005',
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
            telephone: '0120-2445252',
            contactType: 'customer service',
          },
          sameAs: [
            'https://facebook.com/amityuniversity',
            'https://instagram.com/amityuniversity',
            'https://linkedin.com/school/amity-university',
            'https://twitter.com/AmityUni',
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
              name: 'Media Coverage',
              item: pageUrl,
            },
          ],
        },

        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: 'Amity University Noida',
          publisher: { '@id': `${baseUrl}/#college` },
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
