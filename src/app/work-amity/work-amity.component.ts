import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-work-amity',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './work-amity.component.html',
  styleUrl: './work-amity.component.css',
})
export class WorkAmityComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getWorkAmityMeta().subscribe({
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
          this.setCanonicalLink(canonicalUrl);

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = canonicalUrl;

          const title =
            metaData.Title ||
            'Work at Amity – Careers at Amity University Noida';

          const description =
            metaData.Description ||
            'Explore career opportunities at Amity University Noida including faculty jobs, administrative roles, research positions, and staff openings.';

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
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/work-amity`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Work at Amity – Career Opportunities',
          description:
            metaData.Description ||
            'Explore career opportunities, faculty openings, administrative roles, research positions, and staff vacancies at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}#university` },
          mainEntity: { '@id': `${canonicalUrl}#job-list` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb-work-amity` },
        },

        /* ================= JOB LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#job-list`,
          name: 'Current Job Openings',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: { '@id': `${canonicalUrl}#job-1` },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: { '@id': `${canonicalUrl}#job-2` },
            },
          ],
        },

        /* ================= JOB 1 ================= */
        {
          '@type': 'JobPosting',
          '@id': `${canonicalUrl}#job-1`,
          title: 'Assistant Professor – Computer Science',
          description:
            'Amity University Noida invites applications for the position of Assistant Professor in the Department of Computer Science.',
          datePosted: '2024-01-10',
          employmentType: 'FULL_TIME',
          hiringOrganization: { '@id': `${baseUrl}#university` },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sector 125',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201313',
              addressCountry: 'IN',
            },
          },
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'India',
          },
          url: `${canonicalUrl}/job-1`,
        },

        /* ================= JOB 2 ================= */
        {
          '@type': 'JobPosting',
          '@id': `${canonicalUrl}#job-2`,
          title: 'Administrative Officer',
          description:
            'Amity University Noida is seeking an Administrative Officer to support campus operations and manage administrative functions.',
          datePosted: '2024-01-18',
          employmentType: 'FULL_TIME',
          hiringOrganization: { '@id': `${baseUrl}#university` },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sector 125',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201313',
              addressCountry: 'IN',
            },
          },
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'India',
          },
          url: `${canonicalUrl}/job-2`,
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
            'Amity University Noida offers diverse career opportunities for academic, administrative, research, and technical professionals across departments.',
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
              telephone: '+91-XXXXXXXXXX',
              email: 'careers@amity.edu',
              contactType: 'career inquiries',
              areaServed: 'Worldwide',
            },
            {
              '@type': 'ContactPoint',
              telephone: '+91-XXXXXXXXXX',
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
          '@id': `${canonicalUrl}#breadcrumb-work-amity`,
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
              name: 'Work at Amity',
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
