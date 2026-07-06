import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-integrated-programs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './integrated-programs.component.html',
  styleUrl: './integrated-programs.component.css',
})
export class IntegratedProgramsComponent implements OnInit {
  IntegratedUgData: any = [];

  constructor(
    private apiService: ApiService,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.getAllIntegratedUgPrograms();
  }

  getAllIntegratedUgPrograms() {
    this.apiService.getIntegratedUgPrograms().subscribe((data: any) => {
      this.IntegratedUgData = data.Programs;

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

        // Prepare dynamic values
        const pageUrl = pageData.canonicalUrl || window.location.href;

        const title =
          pageData.Title || 'Integrated Programmes – Amity University Noida';

        const description =
          pageData.Description ||
          'Explore all integrated undergraduate–postgraduate programs offered across disciplines at Amity University Noida.';

        const imageUrl = pageData.ImageUrl
          ? `https://noida.amity.edu/${pageData.ImageUrl}`
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
    const pageUrl = pageData.CanonicalUrl || `${baseUrl}/integrated-programs`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          name:
            pageData.Title || 'Integrated Programmes – Amity University Noida',
          description:
            pageData.Description ||
            'Explore all integrated undergraduate–postgraduate programs offered across disciplines at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}/#organization` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: { '@id': `${pageUrl}#integrated-program-list` },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#integrated-program-list`,
          name: 'Integrated Program List',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: this.IntegratedUgData?.map(
            (program: any, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'EducationalOccupationalProgram',
                '@id': `${pageUrl}#program-${index + 1}`,
                name: program.ProgramName || program.Title,
                description:
                  program.Description ||
                  'Integrated academic program offered by Amity University Noida.',
                provider: { '@id': `${baseUrl}/#university` },
              },
            }),
          ),
        },

        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          description:
            'A leading university known for academic excellence, innovation, and global partnerships.',
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
              name: 'Integrated Programmes',
              item: pageUrl,
            },
          ],
        },

        {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
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
