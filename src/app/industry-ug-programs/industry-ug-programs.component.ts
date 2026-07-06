import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-industry-ug-programs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './industry-ug-programs.component.html',
  styleUrl: './industry-ug-programs.component.css',
})
export class IndustryUGProgramsComponent implements OnInit {
  IndustryUgData: any = [];

  constructor(
    private apiService: ApiService,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.getAllIndustryUgPrograms();
  }

  getAllIndustryUgPrograms() {
    this.apiService.getIndustryUgPrograms().subscribe((data: any) => {
      this.IndustryUgData = data.Programs;

      const pageData = data && data.length > 0 ? data[0] : null;
      if (pageData) {
        // Set the page title with a fallback
        this.titleService.setTitle(pageData.Title || 'Default Title');

        // Update meta tags with fallbacks
        this.meta.updateTag({
          name: 'description',
          content: pageData.Description || 'Default description',
        });
        this.meta.updateTag({
          name: 'keywords',
          content: pageData.Keywords || 'default, keywords',
        });

        // ================= Open Graph Meta Tags =================
        this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

        this.meta.updateTag({ property: 'og:type', content: 'website' });

        this.meta.updateTag({
          property: 'og:title',
          content:
            pageData.Title || 'Industry UG Programs – Amity University Noida',
        });

        this.meta.updateTag({
          property: 'og:description',
          content:
            pageData.Description ||
            'Explore all Industry-integrated Undergraduate Programs offered by Amity University Noida.',
        });

        this.meta.updateTag({
          property: 'og:url',
          content: pageData.CanonicalUrl || window.location.href,
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
          content: 'Industry UG Programs – Amity University Noida',
        });

        // ================= Twitter (X) Meta Tags =================
        this.meta.updateTag({
          name: 'twitter:card',
          content: 'summary_large_image',
        });

        this.meta.updateTag({
          name: 'twitter:title',
          content:
            pageData.Title || 'Industry UG Programs – Amity University Noida',
        });

        this.meta.updateTag({
          name: 'twitter:description',
          content:
            pageData.Description ||
            'Explore all Industry-integrated Undergraduate Programs offered by Amity University Noida.',
        });

        this.meta.updateTag({
          name: 'twitter:image',
          content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
        });

        this.meta.updateTag({
          name: 'twitter:image:alt',
          content: 'Industry UG Programs – Amity University Noida',
        });

        this.meta.updateTag({
          name: 'twitter:site',
          content: '@AmityUni',
        });

        this.meta.updateTag({
          name: 'twitter:creator',
          content: '@AmityUni',
        });

        // Set canonical link with a fallback
        // Set canonical link
        this.setCanonicalLink(pageData.canonicalUrl || window.location.href);

        // Call function to inject structured schema
        this.injectStructuredData(pageData);
      } else {
        console.warn('No page data found');
      }
    });
  }

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const pageUrl = pageData.CanonicalUrl || `${baseUrl}/industry-ug-details`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          name:
            pageData.Title ||
            'Industry UG Program Details – Amity University Noida',
          description:
            pageData.Description ||
            'Explore all Industry-integrated Undergraduate Programs offered by Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: { '@id': `${pageUrl}#industry-ug-list` },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#industry-ug-list`,
          name: 'Industry UG Program List',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: this.IndustryUgData.map(
            (program: any, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@id': `${pageUrl}#ug-program-${index + 1}`,
              },
            }),
          ),
        },

        ...this.IndustryUgData.map((program: any, index: number) => ({
          '@type': 'EducationalOccupationalProgram',
          '@id': `${pageUrl}#ug-program-${index + 1}`,
          name:
            program.ProgramName ||
            `Industry Integrated UG Program ${index + 1}`,
          description:
            program.Description ||
            'Industry-integrated undergraduate program combining academic learning with real-world exposure.',
          provider: { '@id': `${baseUrl}/#university` },
        })),

        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          description:
            'India’s leading private university offering industry-ready undergraduate and postgraduate programs.',
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
              name: 'Industry UG Programs',
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

  private setCanonicalLink(url: string) {
    // Remove any existing canonical link
    const link: HTMLLinkElement =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);

    // Append to head if it's a new element
    if (!link.parentNode) {
      document.head.appendChild(link);
    }
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
