import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ug-3-continent',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ug-3-continent.component.html',
  styleUrl: './ug-3-continent.component.css',
})
export class Ug3ContinentComponent implements OnInit {
  UG3ContinentData: any = [];

  constructor(
    private apiService: ApiService,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.getAllUG3ContinentUgPrograms();
  }

  getAllUG3ContinentUgPrograms() {
    this.apiService.GetUG3ContinentPrograms().subscribe((data: any) => {
      this.UG3ContinentData = data.Programs;
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
        const pageUrl = pageData.CanonicalUrl || window.location.href;

        const title =
          pageData.Title ||
          'UG 3-Continent Programmes – Amity University Noida';

        const description =
          pageData.Description ||
          'Explore UG 3-Continent programmes at Amity University Noida offering global exposure across international campuses.';

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
    const canonicalUrl = pageData.CanonicalUrl || `${baseUrl}/ug-3-continent`;

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
            'UG 3-Continent Programmes – Amity University Noida',
          description:
            pageData.Description ||
            'Explore undergraduate 3-continent programmes offered by Amity University Noida with global exposure across multiple international campuses.',
          isPartOf: { '@id': `${baseUrl}#university` },
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb-ug-3-continent`,
          },
          mainEntity: {
            '@id': `${canonicalUrl}#ug-3-continent-program-list`,
          },
        },

        /* ================= PROGRAM LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#ug-3-continent-program-list`,
          name: 'UG 3-Continent Programme List',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: this.UG3ContinentData.map((p: any, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'EducationalOccupationalProgram',
              '@id': `${canonicalUrl}#${this.formatFacultyName(p.sfullname)}`,
              name: p.sfullname,
              description:
                p.sshortdesc ||
                'UG 3-Continent undergraduate programme offered by Amity University Noida.',
              programType: 'Undergraduate 3-Continent Program',
              provider: { '@id': `${baseUrl}#university` },
            },
          })),
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
            'Amity University Noida offers globally focused undergraduate programs, including innovative 3-continent programs with international exposure.',
        },

        /* ================= BREADCRUMB ================= */
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb-ug-3-continent`,
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
              name: 'UG 3-Continent Programmes',
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
      .trim() // Trim leading and trailing spaces
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
