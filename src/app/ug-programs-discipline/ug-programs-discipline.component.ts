import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { UgProgramSearchComponent } from '../ug-program-search/ug-program-search.component';
import { CommonModule } from '@angular/common';

declare var gtag: any; // Declare gtag for Google Analytics

@Component({
  selector: 'app-ug-programs-discipline',
  standalone: true,
  imports: [RouterLink, UgProgramSearchComponent, CommonModule],
  templateUrl: './ug-programs-discipline.component.html',
  styleUrl: './ug-programs-discipline.component.css',
})
export class UgProgramsDisciplineComponent implements OnInit {
  getUgDisciplineData: any = [];
  IndustryUgData: any = [];
  UG3ContinentData: any = [];
  getAllnternationalProgramsData: any = [];
  UGEveningData: any = [];
  IntegratedUgData: any = [];
  GetDisciplineCourseData: any[] = [];
  selectedCategory: string = '';
  flatData: any[] = [];
  groupedData: any[] = [];
  loading: boolean = false;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.getUgDiscipline();
    this.updateMetaTags();
    this.getAllIndustryUgPrograms();
    this.getAllUG3ContinentUgPrograms();
    this.getAllnternationalPrograms();
    //this.getAlUGEveningPrograms();
    this.getAllIntegratedUgPrograms();
    this.GetAllDisciplineCourse();
    this.selectedCategory = 'popularity';
    this.loadDefaultFlatList();
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

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;

    if (this.selectedCategory === 'name') {
      this.ProgrambyName();
    } else if (this.selectedCategory === 'popularity') {
      this.ProgrambyPopularity();
    } else if (this.selectedCategory === 'discipline') {
      this.ProgramByDiscipline();
    }
  }

  loadDefaultFlatList() {
    this.apiService.GetAllCoursewithoutDiscipline().subscribe((data: any[]) => {
      this.flatData = data;
    });
  }

  ProgrambyPopularity() {
    this.loading = true;

    this.apiService.GetAllCoursewithoutDiscipline().subscribe((data: any[]) => {
      this.flatData = data;

      this.loading = false;
    });
  }

  ProgrambyName() {
    this.loading = true;

    this.apiService.GetAllCoursewithoutDiscipline().subscribe((data: any[]) => {
      this.flatData = data.sort((a, b) =>
        a.sfullname.localeCompare(b.sfullname),
      );
      this.loading = false;
    });
  }

  ProgramByDiscipline() {
    this.loading = true;

    this.apiService.GetAllCoursewithoutDiscipline().subscribe((data: any[]) => {
      const grouped: any = {};

      data.forEach((item) => {
        const d = item.sDiscipline || 'Other';
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(item);
      });

      this.groupedData = Object.keys(grouped).map((key) => ({
        discipline: key,
        courses: grouped[key],
      }));

      this.loading = false;
    });
  }

  GetAllDisciplineCourse(): void {
    this.apiService.GetAllCoursewithoutDiscipline().subscribe((data: any[]) => {
      this.GetDisciplineCourseData = data;
    });
  }

  getUgDiscipline() {
    this.apiService.getAllUgDiscipline().subscribe((data: any) => {
      this.getUgDisciplineData = data;
    });
  }

  getAllIndustryUgPrograms() {
    this.apiService.getIndustryUgPrograms().subscribe((data: any) => {
      this.IndustryUgData = data.Programs;
    });
  }

  getAllUG3ContinentUgPrograms() {
    this.apiService.GetUG3ContinentPrograms().subscribe((data: any) => {
      this.UG3ContinentData = data.Programs;
    });
  }

  getAllnternationalPrograms() {
    this.apiService.GetUGInternationalPrograms().subscribe((data: any) => {
      this.getAllnternationalProgramsData = data.Programs;
    });
  }

  // getAlUGEveningPrograms() {
  //   this.apiService.getUGEveningPrograms().subscribe((data: any) => {
  //     this.UGEveningData = data.Programs;
  //   });
  // }

  getAllIntegratedUgPrograms() {
    this.apiService.getIntegratedUgPrograms().subscribe((data: any) => {
      this.IntegratedUgData = data.Programs;
    });
  }

  updateMetaTags(): void {
    this.apiService.getUgMeta().subscribe({
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
          this.setCanonicalLink(canonicalUrl);

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = canonicalUrl;

          const title =
            metaData.Title || 'UG Programmes – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore all undergraduate programmes at Amity University Noida including engineering, management, design, and more with flexible sorting and filtering options.';

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

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const pagePath = pageData.CanonicalUrl || window.location.pathname;
    const pageUrl = pagePath.startsWith('http')
      ? pagePath
      : `${baseUrl}${pagePath}`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PROGRAM PAGE ================= */
        {
          '@type': ['EducationalOccupationalProgram', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          name: pageData.Title,
          description: pageData.Description,
          programType: 'Undergraduate Program',
          provider: { '@id': '#university' },
          hasCourse: { '@id': '#course-details' },
          occupationalCredentialAwarded:
            pageData.DegreeName || 'Undergraduate Degree',
          breadcrumb: { '@id': '#breadcrumb-ug-program-details' },
        },

        /* ================= COURSE ================= */
        {
          '@type': 'Course',
          '@id': '#course-details',
          name: pageData.CourseName || `${pageData.Title} Core Curriculum`,
          description:
            pageData.CourseDescription ||
            'Core curriculum covering foundational and advanced undergraduate subjects.',
          provider: { '@id': '#university' },
        },

        /* ================= UNIVERSITY ================= */
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': '#university',
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          description:
            'A leading university offering industry-oriented undergraduate programs.',
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
              name: 'Undergraduate Programmes',
              item: `${baseUrl}/ug`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: pageData.Title,
              item: pageUrl,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: pageData.Title,
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

  private setCanonicalLink(url: string): void {
    // Attempt to find an existing canonical link
    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]',
    );

    if (!link) {
      // If not found, create a new canonical link element
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    // Set the href attribute
    link.setAttribute('href', url);
  }

  // Method to format faculty name for routing by handling multiple spaces and special characters
  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim() // Trim leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
