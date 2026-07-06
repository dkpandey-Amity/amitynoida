import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fee-structure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fee-structure.component.html',
  styleUrl: './fee-structure.component.css',
})
export class FeeStructureComponent {
  allCourses: any[] = [];
  filteredCourses: any[] = [];

  searchTerm: string = '';
  activeTab: string = 'UG';

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.setDefaultMetaTags(); // Set default meta tags immediately
    this.updateMetaTags(); // Then try to update from API
    this.getCourses();
  }

  // ================= DEFAULT META TAGS =================
  setDefaultMetaTags(): void {
    // ================= BASIC META =================
    this.titleService.setTitle('Fee Structure – Amity University Noida');

    this.meta.updateTag({
      name: 'description',
      content: 'Explore UG, PG and PhD fee structure at Amity University Noida. Check course-wise fees, semester-wise breakdown, and payment details.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'Amity fee structure, Amity University Noida fee, UG fees, PG fees, PhD fees, course fees'
    });

    // ================= CANONICAL =================
    this.setCanonicalLink(window.location.href);

    // ================= OG + TWITTER =================
    const pageUrl = window.location.href;
    const title = 'Fee Structure – Amity University Noida';
    const description = 'Explore UG, PG and PhD fee structure at Amity University Noida. Check course-wise fees, semester-wise breakdown, and payment details.';
    const imageUrl = 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

    // ===== Open Graph =====
    this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:site_name', content: 'Amity University Noida' });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: title });

    // ===== Twitter =====
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: title });
    this.meta.updateTag({ name: 'twitter:site', content: '@AmityUni' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@AmityUni' });

    // ================= DEFAULT SCHEMA =================
    this.injectDefaultStructuredData();
  }

  // ================= API =================
  getCourses() {
    this.apiService.GetAllGetFeePage().subscribe({
      next: (data: any[]) => {
        this.allCourses = data;
        this.activeTab = 'UG';
        this.filterCourses();
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }

  // ================= TABS =================
  setTab(tab: string) {
    this.activeTab = tab;
    this.filterCourses();
  }

  // ================= FILTER =================
  filterCourses() {
    let data = this.allCourses.filter((c) => {
      const type = c.stype?.toString().trim();

      if (this.activeTab === 'UG') return type === 'G';
      if (this.activeTab === 'PG') return type === 'PG';
      if (this.activeTab === 'PHD') return type.toUpperCase() === 'PHD';

      return false;
    });

    if (this.searchTerm) {
      const normalize = (text: string) => {
        return text?.toLowerCase().replace(/[^a-z0-9]/g, '');
      };

      const search = normalize(this.searchTerm);

      data = data.filter((c) => normalize(c.sfullname).includes(search));
    }

    this.filteredCourses = [...data];
  }

  // ================= META TAGS FROM API =================
  updateMetaTags(): void {
    this.apiService.getFeeStructureMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];

          // Update with API data
          this.titleService.setTitle(
            metaData.Title || 'Fee Structure – Amity University Noida',
          );

          this.meta.updateTag({
            name: 'description',
            content: metaData.Description || 'Explore UG, PG and PhD fee structure at Amity University Noida.'
          });

          this.meta.updateTag({
            name: 'keywords',
            content: metaData.Keywords || 'Amity fee structure, Amity University Noida fee'
          });

          // Update canonical
          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
          this.setCanonicalLink(canonicalUrl);

          // Update OG + Twitter
          const pageUrl = canonicalUrl;
          const title = metaData.Title || 'Fee Structure – Amity University Noida';
          const description = metaData.Description || 'Explore UG, PG and PhD fee structure at Amity University Noida.';
          const imageUrl = 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          this.meta.updateTag({ property: 'og:title', content: title });
          this.meta.updateTag({ property: 'og:description', content: description });
          this.meta.updateTag({ property: 'og:url', content: pageUrl });

          this.meta.updateTag({ name: 'twitter:title', content: title });
          this.meta.updateTag({ name: 'twitter:description', content: description });

          // Update schema
          this.injectStructuredData(metaData);
        } else {
          console.warn('No meta data received or array is empty.');
        }
      },
      error: (error: any) => {
        console.error('Error fetching meta data from API:', error);
        // Keep default meta tags, just ensure canonical is set
        this.setCanonicalLink(window.location.href);
      },
    });
  }

  // ================= DEFAULT STRUCTURED DATA =================
  injectDefaultStructuredData(): void {
    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl = window.location.href;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: 'Fee Structure – Amity University Noida',
          description: 'Explore UG, PG and PhD fee structure at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}#university` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        },
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#fee-programs`,
          name: 'Fee Structure Programs',
          itemListElement: [],
        },
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization', 'Organization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201313',
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
              item: baseUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Fee Structure',
              item: canonicalUrl,
            },
          ],
        },
      ],
    };

    const existingScript = document.getElementById('fee-structure-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'fee-structure-schema';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ================= STRUCTURED DATA (SCHEMA) FROM API =================
  injectStructuredData(metaData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/fee-structure`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Fee Structure – Amity University Noida',
          description: metaData.Description || 'Explore UG, PG and PhD fee structure at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}#university` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        },
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#fee-programs`,
          name: 'Fee Structure Programs',
          itemListElement: [],
        },
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization', 'Organization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201313',
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
              item: baseUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Fee Structure',
              item: canonicalUrl,
            },
          ],
        },
      ],
    };

    const existingScript = document.getElementById('fee-structure-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'fee-structure-schema';
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