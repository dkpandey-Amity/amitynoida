import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { Course } from '../service/course.model';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
})
export class SitemapComponent implements OnInit {
  ugGroupedPrograms: {
    disciplineName: string;
    programs: Course[];
  }[] = [];

  pgGroupedPrograms: {
    disciplineName: string;
    programs: Course[];
  }[] = [];

  phdGroupedPrograms: {
    disciplineName: string;
    programs: Course[];
  }[] = [];

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.getUGPrograms();
    this.getPGPrograms();
    this.getPhdPrograms();
  }

  // ================= PROGRAM LIST =================
  getUGPrograms(): void {
    this.apiService.GetAllCoursewithoutDiscipline().subscribe({
      next: (res: Course[]) => {
        this.ugGroupedPrograms = this.groupByDiscipline(res);
      },
      error: (err) => console.error('UG Error', err),
    });
  }

  getPGPrograms(): void {
    this.apiService.GetAllPgCoursewithoutDiscipline().subscribe({
      next: (res: Course[]) => {
        this.pgGroupedPrograms = this.groupByDiscipline(res);
      },
      error: (err) => console.error('PG Error', err),
    });
  }

  getPhdPrograms(): void {
    this.apiService.GetPhdCourseWithoutDeiscipline().subscribe({
      next: (res: Course[]) => {
        this.phdGroupedPrograms = this.groupByDiscipline(res);
      },
      error: (err) => console.error('Ph.D Error', err),
    });
  }

  private groupByDiscipline(data: Course[]) {
    const map = new Map<string, any>();

    data.forEach((item) => {
      const key = item.sDiscipline?.trim();
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          disciplineName: key,
          programs: [],
        });
      }

      map.get(key).programs.push(item);
    });

    return Array.from(map.values());
  }

  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim() // Trim leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }

  // ================= META TAGS =================
  updateMetaTags(): void {
    this.apiService.getSitemapMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];

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

          const canonicalUrl = metaData.CanonicalUrl || window.location.href;

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = canonicalUrl;

          const title = metaData.Title || 'Sitemap – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore the sitemap of Amity University Noida including undergraduate, postgraduate, PhD programs, admissions, research, campus life, and resources.';

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
          this.injectStructuredData(metaData);
        }
      },
      error: (error) => {
        console.error('Meta API Error:', error);
        this.setCanonicalLink(window.location.href);
      },
    });
  }

  // ================= SCHEMA =================
  injectStructuredData(metaData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/sitemap`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= WEBPAGE ================= */
        {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Sitemap – Amity University Noida',
          description:
            metaData.Description ||
            'Navigate the complete sitemap of Amity University Noida including academics, admissions, programmes, research, campus life, facilities, and resources.',
          isPartOf: { '@id': `${baseUrl}#university` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb-sitemap` },
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
            'Amity University Noida is a world-class academic institution offering multidisciplinary programs, research opportunities, global exposure, and modern campus facilities.',
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

        /* ================= BREADCRUMB ================= */
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb-sitemap`,
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
              name: 'Sitemap',
              item: canonicalUrl,
            },
          ],
        },
      ],
    };

    // Remove existing schema
    const existingScript = document.getElementById('structured-data');
    if (existingScript) existingScript.remove();

    // Inject schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ================= CANONICAL =================
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
