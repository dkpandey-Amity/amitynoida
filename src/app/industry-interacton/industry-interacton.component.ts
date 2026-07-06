import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-industry-interacton',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './industry-interacton.component.html',
  styleUrl: './industry-interacton.component.css',
})
export class IndustryInteractonComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getIndustryInteractonMeta().subscribe({
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
          this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

          this.meta.updateTag({ property: 'og:type', content: 'website' });

          this.meta.updateTag({
            property: 'og:title',
            content:
              metaData.Title || 'Industry Interaction – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Explore Amity University Noida’s partnerships with industry leaders, corporate collaborations, guest lectures, and placement-driven engagements.',
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
            content: 'Industry Interaction – Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content:
              metaData.Title || 'Industry Interaction – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Explore Amity University Noida’s partnerships with industry leaders, corporate collaborations, guest lectures, and placement-driven engagements.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Industry Interaction – Amity University Noida',
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/industry-interacton`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': pageUrl,
          url: pageUrl,
          name:
            metaData.Title || 'Industry Interaction – Amity University Noida',
          description:
            metaData.Description ||
            'Explore Amity University Noida’s partnerships with industry leaders, corporate collaborations, guest lectures, and placement-driven engagements.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
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
            'Amity University Noida is a premier private university offering world-class education, global exposure, and strong industry integration across disciplines.',
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
            email: 'info@amity.edu',
            contactType: 'customer service',
            areaServed: 'IN',
          },
          sameAs: [
            'https://www.facebook.com/amityuni',
            'https://www.instagram.com/amityuniversity/',
            'https://www.linkedin.com/school/amity-university/',
            'https://twitter.com/AmityUni',
          ],
        },

        {
          '@type': 'WebApplication',
          '@id': `${baseUrl}/#webapp`,
          name: 'Amity University Web Application',
          url: baseUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'All',
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
              name: 'Industry Interaction',
              item: pageUrl,
            },
          ],
        },

        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: 'Amity University Noida',
          publisher: { '@id': `${baseUrl}/#university` },
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
