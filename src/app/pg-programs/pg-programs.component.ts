import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PgProgramSearchComponent } from '../pg-program-search/pg-program-search.component';
import { CommonModule } from '@angular/common';

declare var gtag: any; // Declare gtag for Google Analytics

@Component({
  selector: 'app-pg-programs',
  standalone: true,
  imports: [RouterLink, PgProgramSearchComponent, CommonModule],
  templateUrl: './pg-programs.component.html',
  styleUrl: './pg-programs.component.css',
})
export class PgProgramsComponent implements OnInit {
  getPgDisciplineData: any = [];
  IndustryPGData: any = [];
  PG3ContinentData: any = [];
  PGInternationalData: any = [];
  PGIntegratedData: any = [];
  PGEveningData: any = [];
  GetPgDisciplineCourseData: any[] = [];
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
    this.getPgDiscipline();
    this.updateMetaTags();
    this.getAllIndustryPGPrograms();
    this.getAllPG3ContinentPrograms();
    this.getAllPGInternationalPrograms();
    this.getAllIntegratedPgPrograms();
    //this.getAllPGEveningPrograms();
    //this.GetPgCoursewithoutDiscipline();

    this.selectedCategory = 'popularity';
    this.loadDefaultFlatList();
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
    this.apiService
      .GetAllPgCoursewithoutDiscipline()
      .subscribe((data: any[]) => {
        this.flatData = data;
      });
  }

  ProgrambyPopularity() {
    this.loading = true;

    this.apiService
      .GetAllPgCoursewithoutDiscipline()
      .subscribe((data: any[]) => {
        this.flatData = data;
        this.loading = false;
      });
  }

  ProgrambyName() {
    this.loading = true;

    this.apiService
      .GetAllPgCoursewithoutDiscipline()
      .subscribe((data: any[]) => {
        this.flatData = data.sort((a, b) =>
          a.sfullname.localeCompare(b.sfullname),
        );
        this.loading = false;
      });
  }

  // Method to track Apply Now button clicks
  onPGApplyClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log(
    //   'Placeholder:',
    //   'Postgraduate Programs Page ( Apply Now button ) ',
    // );

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Click PG Apply Now',
        placeholder: 'Postgraduate Programs page ( Apply Now button )  ',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Postgraduate Programs page ( Apply Now button ) ',
        eventCategory: 'CTA Click',
        eventAction: 'Click PG Apply Now',
        eventLabel: 'PG Programs',
      });
    }
  }

  // Method to track Apply Now button clicks
  onPGViewClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log(
    //   'Placeholder:',
    //   'Postgraduate Programs page ( View Details button )',
    // );

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Click PG View Now',
        placeholder: 'Postgraduate Programs page ( View Details button )',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Postgraduate Programs page ( View Details button )',
        eventCategory: 'CTA Click',
        eventAction: 'Click PG View Now',
        eventLabel: 'PG Programs',
      });
    }
  }

  ProgramByDiscipline() {
    this.loading = true;

    this.apiService
      .GetAllPgCoursewithoutDiscipline()
      .subscribe((data: any[]) => {
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

  getPgDiscipline() {
    this.apiService.getAllPgDiscipline().subscribe((data: any) => {
      this.getPgDisciplineData = data;
    });
  }

  GetPgCoursewithoutDiscipline(): void {
    this.apiService
      .GetAllPgCoursewithoutDiscipline()
      .subscribe((data: any[]) => {
        this.GetPgDisciplineCourseData = data;
      });
  }

  getAllIndustryPGPrograms() {
    this.apiService.getIndustryPGPrograms().subscribe((data: any) => {
      this.IndustryPGData = data.Programs;
    });
  }

  getAllPG3ContinentPrograms() {
    this.apiService.getPG3ContinentPrograms().subscribe((data: any) => {
      this.PG3ContinentData = data.Programs;
    });
  }

  getAllPGInternationalPrograms() {
    this.apiService.getPGInternationalPrograms().subscribe((data: any) => {
      this.PGInternationalData = data.Programs;
    });
  }

  getAllIntegratedPgPrograms() {
    this.apiService.getIntegratedPgPrograms().subscribe((data: any) => {
      this.PGIntegratedData = data.Programs;
    });
  }

  // getAllPGEveningPrograms() {
  //   this.apiService.getPGEveningPrograms().subscribe((data: any) => {
  //     this.PGEveningData = data.Programs;
  //   });
  // }

  updateMetaTags(): void {
    this.apiService.getPgMeta().subscribe({
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
          const baseUrl = 'https://noida.amity.edu';

          const path = metaData.CanonicalUrl || '/pg';

          const canonicalUrl = path.startsWith('http')
            ? path
            : `${baseUrl}${path}`;

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = canonicalUrl;

          const title =
            metaData.Title || 'PG Programmes – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore postgraduate programmes at Amity University Noida including industry-integrated, international, evening, and integrated courses.';

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
    const pageUrl = `${baseUrl}/pg`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          name: metaData?.Title || 'PG Programmes',
          description:
            metaData?.Description ||
            'Explore all postgraduate programmes offered at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: { '@id': `${pageUrl}#itemlist` },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#itemlist`,
          name: 'Postgraduate Programme List',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'EducationalOccupationalProgram',
                name: 'MBA (Master of Business Administration)',
                url: `${pageUrl}/mba`,
                description:
                  'A comprehensive MBA programme focused on leadership, strategy, and global business.',
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'EducationalOccupationalProgram',
                name: 'M.Tech Computer Science Engineering',
                url: `${pageUrl}/mtech-cse`,
                description:
                  'Advanced postgraduate programme in computer science and emerging technologies.',
              },
            },
          ],
        },

        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/logo.png`,
          description:
            'A leading private university in India offering world-class education.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201301',
            addressCountry: 'India',
          },
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
              name: 'PG Programmes',
              item: pageUrl,
            },
          ],
        },

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
