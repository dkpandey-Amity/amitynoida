import { Component } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CleanHtmlPipe } from '../custompipe/clean-html.pipe';

@Component({
  selector: 'app-pg-programs-list',
  standalone: true,
  imports: [RouterLink, CleanHtmlPipe],
  templateUrl: './pg-programs-list.component.html',
  styleUrl: './pg-programs-list.component.css',
})
export class PgProgramsListComponent {
  getPgProgramData: any;
  iDisciplineId!: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.iDisciplineId = this.route.snapshot.params['Disciplineslugname'];

    //this.iDisciplineId = history.state.code;

    this.apiService
      .getPgDisciplineProgramList(this.iDisciplineId)
      .subscribe((data: any) => {
        this.getPgProgramData = data;

        const pageData = data && data.length > 0 ? data[0] : null;
        if (pageData) {
          // Set the page title with a fallback
          this.titleService.setTitle(
            pageData.DisciplineTitle || 'Default Title',
          );

          // Update meta tags with fallbacks
          this.meta.updateTag({
            name: 'description',
            content: pageData.DisciplineDescription || 'Default description',
          });
          this.meta.updateTag({
            name: 'keywords',
            content: pageData.DisciplineKeywords || 'default, keywords',
          });

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = pageData.canonicalUrl || window.location.href;

          const title =
            pageData.DisciplineTitle || 'PG Programs – Amity University Noida';

          const description =
            pageData.DisciplineDescription ||
            'Explore postgraduate programs under this discipline at Amity University Noida.';

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

    const program =
      this.getPgProgramData && this.getPgProgramData.length > 0
        ? this.getPgProgramData[0]
        : null;

    const pageUrl = pageData.CanonicalUrl || window.location.href;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['EducationalOccupationalProgram', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          name:
            program?.sfullname ||
            pageData.DisciplineTitle ||
            'Postgraduate Programme',
          description:
            pageData.DisciplineDescription ||
            'A postgraduate program focused on advanced academic and professional skills.',
          programType: 'Postgraduate Program',
          provider: { '@id': `${baseUrl}/#college` },
          hasCourse: { '@id': `${pageUrl}#course-details` },
          occupationalCredentialAwarded:
            program?.DegreeName || 'Postgraduate Degree',
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        },

        {
          '@type': 'Course',
          '@id': `${pageUrl}#course-details`,
          name:
            program?.CourseName || program?.sfullname || 'Programme Curriculum',
          description:
            'Core and elective courses designed to develop professional and academic expertise.',
          provider: { '@id': `${baseUrl}/#college` },
        },

        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}/#college`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          description:
            'Amity University Noida is a leading institution offering world-class postgraduate programs.',
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
              name: 'PG',
              item: `${baseUrl}/pg`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: pageData.DisciplineName || 'Discipline',
              item: pageUrl,
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
