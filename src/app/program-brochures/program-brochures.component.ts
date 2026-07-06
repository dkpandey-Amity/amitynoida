import { Component } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-program-brochures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-brochures.component.html',
  styleUrl: './program-brochures.component.css',
})
export class ProgramBrochuresComponent {
  brochures: any[] = [];

  searchText: string = '';
  filteredBrochures: any[] = [];

  ngOnInit() {
    this.updateMetaTags();
    this.getBrochures();
  }

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  getBrochures() {
    this.apiService.GetAllBrouchre().subscribe({
      next: (res: any) => {
        this.brochures = res || [];
        this.filteredBrochures = this.brochures; // ✅ initialize
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  onSearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.searchText = value;

    this.filteredBrochures = this.brochures.filter((item: any) =>
      item.Name?.toLowerCase().includes(value),
    );
  }

  updateMetaTags(): void {
    this.apiService.getProgramBrochureMeta().subscribe({
      next: (data: any[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('No meta data received.');
          this.setCanonicalLink(window.location.href);
          return;
        }

        const metaData = data[0];

        const title = metaData?.Title || 'Amity University, Noida';
        const description = metaData?.Description || 'Amity University, Noida';
        const keywords = metaData?.Keywords || 'Amity University, Noida';
        const canonicalUrl = metaData?.CanonicalUrl || window.location.href;

        // ✅ Set Title
        this.titleService.setTitle(title);

        // ✅ Update Meta Tags
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: keywords });

        // ================= Open Graph + Twitter =================

        // Prepare dynamic values
        const pageUrl = canonicalUrl;

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

        // ✅ Canonical
        this.setCanonicalLink(canonicalUrl);

        // ✅ Structured Data
        this.injectStructuredData({
          ...metaData,
          Title: title,
          Description: description,
          CanonicalUrl: canonicalUrl,
        });
      },
      error: (error) => {
        console.error('Meta API error:', error);
        this.setCanonicalLink(window.location.href);
      },
    });
  }

  injectStructuredData(metaData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl = metaData.CanonicalUrl;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title,
          description: metaData.Description,
          inLanguage: 'en-IN',
          isPartOf: {
            '@id': `${baseUrl}#website`,
          },
          about: {
            '@id': `${baseUrl}#university`,
          },
          dateModified: metaData.LastUpdated || new Date().toISOString(),
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb`,
          },
        },
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
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
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
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
              name: 'Program Brochure',
              item: canonicalUrl,
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          url: baseUrl,
          name: 'Amity University Noida',
        },
      ],
    };

    // ✅ Remove old schema (safe cleanup)
    const oldScript = document.getElementById('structured-data');
    if (oldScript) {
      oldScript.remove();
    }

    // ✅ Create new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(schema);

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
