import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.css',
})
export class FacultyComponent implements OnInit {
  facultyData: any = [];

  facultyListData: any = [];

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();

    this.getFacultyList();

    this.apiService.getNewDistinguishedFacultyList().subscribe((data: any) => {
      this.facultyData = data;
    });
  }

  getFacultyList() {
    this.apiService.getNewFacultyList().subscribe((data: any) => {
      this.facultyListData = data;
    });
  }

  updateMetaTags(): void {
    this.apiService.getFacultyMeta().subscribe({
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
            content: metaData.Title || 'Faculty – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Explore the list of distinguished faculty members at Amity University Noida.',
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
            content: 'https://noida.amity.edu/assets/images/amity-logo.png',
          });

          this.meta.updateTag({
            property: 'og:image:alt',
            content: 'Faculty – Amity University Noida',
          });

          // ================= Twitter (X) =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'Faculty – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Explore the list of distinguished faculty members at Amity University Noida.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content: 'https://noida.amity.edu/assets/images/amity-logo.png',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Faculty – Amity University Noida',
          });

          this.meta.updateTag({ name: 'twitter:site', content: '@AmityUni' });
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/faculty`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          name: metaData.Title || 'Faculty – Amity University Noida',
          description:
            metaData.Description ||
            'Explore the list of distinguished faculty members at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: { '@id': `${pageUrl}#faculty-list` },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#faculty-list`,
          name: 'Faculty Members',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: { '@id': `${pageUrl}#faculty-1` },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: { '@id': `${pageUrl}#faculty-2` },
            },
          ],
        },

        {
          '@type': 'Person',
          '@id': `${pageUrl}#faculty-1`,
          name: 'Dr. Faculty Member One',
          description: 'Professor in the Department of Computer Science.',
          jobTitle: 'Professor',
          image: 'https://noida.amity.edu/assets/faculty/faculty1.jpg',
          email: 'faculty1@amity.edu',
          telephone: '0120-2445252',
          affiliation: { '@id': `${baseUrl}/#university` },
          department: 'Computer Science',
        },

        {
          '@type': 'Person',
          '@id': `${pageUrl}#faculty-2`,
          name: 'Dr. Faculty Member Two',
          description: 'Senior Lecturer in the Department of Management.',
          jobTitle: 'Senior Lecturer',
          image: 'https://noida.amity.edu/assets/faculty/faculty2.jpg',
          email: 'faculty2@amity.edu',
          telephone: '0120-2445252',
          affiliation: { '@id': `${baseUrl}/#university` },
          department: 'Management',
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
            'Amity University Noida is home to globally renowned faculty and academic leaders.',
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
              name: 'Faculty',
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
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
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

  // Method to format faculty name for routing by handling multiple spaces and special characters
  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim() // Trim leading and trailing spaces
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
