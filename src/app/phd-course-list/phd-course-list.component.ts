import { Component } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-phd-course-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './phd-course-list.component.html',
  styleUrl: './phd-course-list.component.css',
})
export class PhdCourseListComponent {
  sDiscipline!: string;
  sfullname!: string;
  getPhdProgramData: any;
  iDisciplineId!: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.sDiscipline = this.route.snapshot.params['Disciplineslugname'];

    this.apiService
      .getAllPhdCourseBasedonDiscipline(this.sDiscipline)
      .subscribe({
        next: (data: any) => {
          this.getPhdProgramData = data;

          const pageData = data && data.length > 0 ? data[0] : null;
          if (pageData) {
            this.titleService.setTitle(
              pageData.DisciplineTitle || 'Ph.D Programs',
            );
            this.meta.updateTag({
              name: 'description',
              content:
                pageData.DisciplineDescription ||
                'Amity University Ph.D Programs',
            });
            this.meta.updateTag({
              name: 'keywords',
              content:
                pageData.DisciplineKeywords || 'Amity University Ph.D Programs',
            });

            // ================= Open Graph + Twitter =================

            // Prepare dynamic values
            const pageUrl = pageData.canonicalUrl || window.location.href;

            const title =
              pageData.DisciplineTitle ||
              'PhD Programs – Amity University Noida';

            const description =
              pageData.DisciplineDescription ||
              'Explore PhD programmes at Amity University Noida across multiple disciplines with research-focused doctoral education.';

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

            this.setCanonicalLink(
              pageData.canonicalUrl || window.location.href,
            );
            this.injectStructuredData(pageData);
          } else {
            console.warn('No page data found');
          }
        },
        error: (err: any) => {
          console.error('Error fetching PhD program data:', err);
        },
      });
  }

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const disciplineSlug = this.formatFacultyName(pageData.sDiscipline);
    const pageUrl = pageData.CanonicalUrl || `${baseUrl}/phd/${disciplineSlug}`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name:
            pageData.DisciplineTitle ||
            `PhD Programmes in ${pageData.sDiscipline}`,
          description:
            pageData.DisciplineDescription ||
            `Explore PhD programmes in ${pageData.sDiscipline} at Amity University Noida.`,
          inLanguage: 'en',
          isPartOf: { '@id': `${baseUrl}/#website` },
          about: { '@id': `${baseUrl}/#university` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: { '@id': `${pageUrl}#program-list` },
        },

        /* ================= ITEM LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#program-list`,
          name: `PhD Programmes in ${pageData.sDiscipline} at Amity University Noida`,
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: this.getPhdProgramData?.length || 0,
          itemListElement: this.getPhdProgramData.map(
            (item: any, index: number) => {
              const programSlug = this.formatFacultyName(item.Title);

              return {
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'EducationalOccupationalProgram',
                  '@id': `${pageUrl}/${programSlug}#program`,
                  name: item.DisciplineTitle,
                  url: `${pageUrl}/${programSlug}`,
                  description:
                    item.DisciplineDescription ||
                    pageData.DisciplineDescription,
                  educationalLevel: 'Doctoral',
                  programType: 'PhD Programme',
                  educationalCredentialAwarded: 'PhD',
                  ...(item.Mode && {
                    educationalProgramMode: item.Mode,
                  }),
                  ...(item.OccupationalCategory && {
                    occupationalCategory: item.OccupationalCategory,
                  }),
                  provider: {
                    '@id': `${baseUrl}/#university`,
                  },
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
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201313',
            addressCountry: 'IN',
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
              item: `${baseUrl}/phd`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: pageData.sDiscipline,
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

    const existing = document.getElementById('structured-data');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private setCanonicalLink(url: string): void {
    let link: HTMLLinkElement =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);

    if (!link.parentNode) {
      document.head.appendChild(link);
    }
  }

  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim() // Trim leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
  }
}
