import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { MetaService } from '../service/meta.service';

@Component({
  selector: 'app-about-university',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-university.component.html',
  styleUrl: './about-university.component.css',
})
export class AboutUniversityComponent {
  constructor(
    private metaService: MetaService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getAboutUniversitymeta().subscribe({
      next: (data: any) => {
        let metaData;

        if (Array.isArray(data)) {
          metaData = data[0];
        } else if (data?.data) {
          metaData = data.data[0];
        } else {
          metaData = data;
        }

        if (!metaData) return;

        // ✅ ONLY ONE LINE NOW
        this.metaService.setMeta(metaData);

        // keep schema separate
        this.injectStructuredData(metaData);
      },
    });
  }

  injectStructuredData(metaData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/about-university`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['AboutPage', 'WebPage'],
          '@id': `${pageUrl}#aboutpage`,
          url: pageUrl,
          name: metaData.Title || 'About Amity University Noida',
          description:
            metaData.Description ||
            'Learn about Amity University Noida, its vision, mission, leadership, and academic excellence.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          about: {
            '@id': `${baseUrl}/#university`,
          },
          mainEntity: {
            '@id': `${baseUrl}/#university`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
        },

        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}/#university`,
          name: metaData.UniversityName || 'Amity University Noida',
          url: `${baseUrl}/`,
          logo: {
            '@type': 'ImageObject',
            url: 'https://noida.amity.edu/assets/images/amity-logo.png',
          },
          foundingDate: '2005',
          description:
            'Amity University Noida is a leading private university in India known for academic excellence, research, and global exposure.',
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
              name: 'About University',
              item: pageUrl,
            },
          ],
        },

        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: metaData.UniversityName || 'Amity University Noida',
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
