import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { CleanHtmlPipe } from '../custompipe/clean-html.pipe';

declare var gtag: any; // Declare gtag for Google Analytics

@Component({
  selector: 'app-ug-programs',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, CleanHtmlPipe],
  templateUrl: './ug-programs.component.html',
  styleUrl: './ug-programs.component.css',
})
export class UgProgramsComponent {
  sDiscipline!: string;
  SlugName!: string;
  getUgProgramData: any;
  iDisciplineId!: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    //this.iDisciplineId = history.state.code;

    this.iDisciplineId = this.route.snapshot.params['Disciplineslugname'];

    this.apiService
      .getUgDisciplineProgramList(this.iDisciplineId)
      .subscribe((data: any) => {
        this.getUgProgramData = data;
        console.log(data);

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

          // Set canonical link with a fallback
          // Set canonical link
          this.setCanonicalLink(pageData.canonicalUrl || window.location.href);

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = pageData?.CanonicalUrl || window.location.href;

          const title =
            pageData?.DisciplineTitle ||
            'UG Programmes – Amity University Noida';

          const description =
            pageData?.DisciplineDescription ||
            'Explore undergraduate programmes at Amity University Noida across various disciplines with industry-oriented curriculum.';

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

          // Call function to inject structured schema
          this.injectStructuredData(pageData);
        } else {
          console.warn('No page data found');
        }
      });
  }

  // Method to track Apply Now button clicks
  onUGApplyClick(eventName: string): void {
    console.log('Event Triggered:', eventName);
    console.log(
      'Placeholder:',
      'Undergraduate Programs page ( Apply Now button ) ',
    );

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Click UG Apply Now',
        placeholder: 'Undergraduate Programs page ( Apply Now button )  ',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Undergraduate Programs page ( Apply Now button ) ',
        eventCategory: 'CTA Click',
        eventAction: 'Click UG Apply Now',
        eventLabel: 'UG Programs',
      });
    }
  }

  // Method to track Apply Now button clicks
  onUGViewClick(eventName: string): void {
    console.log('Event Triggered:', eventName);
    console.log(
      'Placeholder:',
      'Undergraduate Programs page ( View Details button ) ',
    );

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Click UG View Now',
        placeholder: 'Undergraduate Programs page ( View Details button ) ',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Undergraduate Programs page ( View Details button )',
        eventCategory: 'CTA Click',
        eventAction: 'Click UG View Now',
        eventLabel: 'UG Programs',
      });
    }
  }

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';

    const path = pageData.CanonicalUrl || window.location.pathname;

    const pageUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PROGRAM PAGE ================= */
        {
          '@type': ['EducationalOccupationalProgram', 'WebPage', 'Course'],
          '@id': pageUrl,
          url: pageUrl,
          name: pageData.DisciplineTitle,
          description: pageData.DisciplineDescription,
          programType: 'Undergraduate Programme',
          provider: { '@id': `${baseUrl}#university` },
          hasCourse: { '@id': '#course-details' },
          mainEntity: { '@id': '#course-details' },
          occupationalCredentialAwarded:
            pageData.DegreeName || 'Undergraduate Degree',
          breadcrumb: { '@id': '#breadcrumb-ug-program-details' },
        },

        /* ================= COURSE DETAILS ================= */
        {
          '@type': 'Course',
          '@id': '#course-details',
          name:
            pageData.CourseName ||
            `${pageData.DisciplineTitle} Core Curriculum`,
          description:
            pageData.DisciplineDescription ||
            'Covers programming fundamentals, data structures, algorithms, and system design.',
          provider: { '@id': `${baseUrl}#university` },
        },

        /* ================= UNIVERSITY ================= */
        {
          '@type': [
            'CollegeOrUniversity',
            'EducationalOrganization',
            'Organization',
          ],
          '@id': '#university',
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          description:
            'A leading university offering industry-oriented undergraduate programs.',
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
        },

        /* ================= BREADCRUMB ================= */
        {
          '@type': 'BreadcrumbList',
          '@id': '#breadcrumb-ug-program-details',
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
              name: 'UG',
              item: `${baseUrl}/ug`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: pageData.sDiscipline || 'Discipline',
              item: `${baseUrl}/ug/${pageData.Disciplineslugname}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: pageData.DisciplineTitle,
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
