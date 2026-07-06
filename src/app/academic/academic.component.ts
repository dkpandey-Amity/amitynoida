import { AfterViewInit, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

declare var $: any; // This tells TypeScript that $ (jQuery) exists

@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './academic.component.html',
  styleUrl: './academic.component.css',
})
export class AcademicComponent implements AfterViewInit {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getAcademicMeta().subscribe({
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
            content: metaData.Title || 'Academic – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Explore the academic excellence, departments, and programs offered at Amity University Noida.',
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
            content: 'Amity University Noida Campus',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'Academic – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Explore the academic excellence, departments, and programs offered at Amity University Noida.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              'https://noida.amity.edu/assets/img/update1/hero/slider-1.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Amity University Noida Campus',
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/academic`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': pageUrl,
          url: pageUrl,
          name: metaData.Title || 'Academic',
          description:
            metaData.Description ||
            'Explore the academic excellence, departments, and programs offered at Amity University Noida.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
        },

        {
          '@type': 'CollegeOrUniversity',
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          description:
            'Amity University Noida is a premier institution known for innovation-driven teaching and world-class infrastructure.',
          logo: {
            '@type': 'ImageObject',
            url: 'https://noida.amity.edu/assets/logo.png',
          },
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
            email: 'info@amity.edu',
            areaServed: 'IN',
          },
          sameAs: [
            'https://www.facebook.com/amityuni',
            'https://www.instagram.com/amityuniversity',
            'https://www.linkedin.com/school/amity-university',
            'https://twitter.com/AmityUniversity',
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
              name: 'Academic',
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

  ngAfterViewInit() {
    // Now you can use jQuery safely here
    $('[data-fancybox]').fancybox({
      loop: true,
      buttons: ['zoom', 'close'],
    });
  }
}
