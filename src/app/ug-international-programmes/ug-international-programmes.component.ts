import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ug-international-programmes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ug-international-programmes.component.html',
  styleUrl: './ug-international-programmes.component.css',
})
export class UgInternationalProgrammesComponent implements OnInit {
  getAllnternationalProgramsData: any = [];

  constructor(
    private apiService: ApiService,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.getAllnternationalPrograms();
  }

  getAllnternationalPrograms() {
    this.apiService.GetUGInternationalPrograms().subscribe((data: any) => {
      this.getAllnternationalProgramsData = data.Programs;
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

        // Set canonical link with a fallback
        // Set canonical link
        this.setCanonicalLink(pageData.canonicalUrl || window.location.href);

        // ================= Open Graph + Twitter =================

        // Prepare dynamic values
        const pageUrl = pageData?.CanonicalUrl || window.location.href;

        const title =
          pageData?.Title ||
          'UG International Programmes – Amity University Noida';

        const description =
          pageData?.Description ||
          'Explore undergraduate international programmes at Amity University Noida offering global exposure, international collaborations, and overseas study opportunities.';

        const imageUrl = 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

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
        this.injectStructuredData(pageData);
      } else {
        console.warn('No page data found');
      }
    });
  }

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl =
      pageData.CanonicalUrl || `${baseUrl}/ug-international-programmes`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name:
            pageData.Title ||
            'UG International Programmes – Amity University Noida',
          description:
            pageData.Description ||
            'Explore undergraduate international programmes offering global exposure, international collaborations, and overseas study opportunities at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}#university` },
          mainEntity: {
            '@id': `${canonicalUrl}#ug-international-program-list`,
          },
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb-ug-international`,
          },
        },

        /* ================= PROGRAM LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#ug-international-program-list`,
          name: 'UG International Programme List',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: this.getAllnternationalProgramsData.map(
            (program: any, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'EducationalOccupationalProgram',
                '@id': `${baseUrl}/${program.slug || program.CourseCode}`,
                name: program.sfullname || program.ProgramName,
                description:
                  program.Description ||
                  'Undergraduate international programme offered by Amity University Noida.',
                programType: 'Undergraduate International Program',
                provider: {
                  '@id': `${baseUrl}#university`,
                },
              },
            }),
          ),
        },

        /* ================= UNIVERSITY ================= */
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          foundingDate: '2005',
          description:
            'Amity University Noida offers globally aligned undergraduate international programmes with overseas exposure and academic partnerships.',
        },

        /* ================= BREADCRUMB ================= */
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb-ug-international`,
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
              name: 'UG International Programmes',
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
      .trim()
      .toLowerCase() // Trim leading and trailing spaces
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
