import { Component } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhdProgramSearchComponent } from '../phd-program-search/phd-program-search.component';
import { Meta, Title } from '@angular/platform-browser';

declare var gtag: any; // Declare gtag for Google Analytics

@Component({
  selector: 'app-phd-discipline-list',
  standalone: true,
  imports: [RouterLink, CommonModule, PhdProgramSearchComponent],
  templateUrl: './phd-discipline-list.component.html',
  styleUrl: './phd-discipline-list.component.css',
})
export class PhdDisciplineListComponent {
  PhdDisciplineList: any = [];
  getAllPhdCourseDeiscipline: any = [];

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.getPhdDisciplineList();
    this.getAllPhdCourse();
  }

  getAllPhdCourse() {
    this.apiService.GetPhdCourseWithoutDeiscipline().subscribe({
      next: (data: any) => {
        this.getAllPhdCourseDeiscipline = data;
      },
      error: (err) => {
        console.error('Error fetching PhD discipline list', err);
      },
    });
  }

  getPhdDisciplineList() {
    this.apiService.getPhdDisciplineList().subscribe({
      next: (data: any) => {
        this.PhdDisciplineList = data;
      },
      error: (err) => {
        console.error('Error fetching PhD discipline list', err);
      },
    });
  }

  onPhdApplyClick(eventName: string): void {
    console.log('Event Triggered:', eventName);

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'PhD Apply Now',
        value: 1,
      });
    }

    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        eventCategory: 'CTA Click',
        eventAction: 'PhD Apply Click',
        eventLabel: 'PhD Programs',
      });
    }
  }

  onPhdViewClick(eventName: string): void {
    console.log('Event Triggered:', eventName);

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'PhD View Details',
        value: 1,
      });
    }

    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        eventCategory: 'CTA Click',
        eventAction: 'PhD View Click',
        eventLabel: 'PhD Programs',
      });
    }
  }

  updateMetaTags(): void {
    this.apiService.getPhdMeta().subscribe({
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

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = canonicalUrl;

          const title =
            metaData.Title || 'PhD Programmes – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore PhD programmes at Amity University Noida across engineering, management, science, and humanities disciplines with research-driven doctoral education.';

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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/phd`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: metaData.Title || 'PhD Programmes at Amity University Noida',
          description:
            metaData.Description ||
            'Explore doctoral programmes across engineering, science, management, and humanities at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          about: { '@id': `${baseUrl}/#university` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: { '@id': `${pageUrl}#phd-program-list` },
        },

        /* ================= ITEM LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#phd-program-list`,
          name: 'PhD Programmes at Amity University Noida',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: this.getAllPhdCourseDeiscipline?.length || 0,
          itemListElement: this.getAllPhdCourseDeiscipline.map(
            (item: any, index: number) => {
              const slug = this.formatFacultyName(item.sDiscipline);

              return {
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'EducationalOccupationalProgram',
                  '@id': `${pageUrl}#phd-${slug}`,
                  name: item.sDiscipline,
                  url: `${pageUrl}/${slug}`,
                  educationalLevel: 'Doctoral',
                  programType: 'PhD Programme',
                  provider: { '@id': `${baseUrl}/#university` },
                },
              };
            },
          ),
        },

        /* ================= UNIVERSITY ================= */
        {
          '@type': 'CollegeOrUniversity',
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/assets/images/amity-logo.png`,
          },
        },

        /* ================= BREADCRUMB ================= */
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
              name: 'PhD Programmes',
              item: pageUrl,
            },
          ],
        },

        /* ================= WEBSITE ================= */
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'Amity University Noida',
          publisher: { '@id': `${baseUrl}/#university` },
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

  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
