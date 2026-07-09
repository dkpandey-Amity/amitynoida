import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent {
  blogsAllData: any[] = [];
  paginatedEvents: any[] = [];

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 12; // Number of events per page
  totalPages: number = 0;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    // Fetch all events data from API
    this.apiService.getAllBlogs().subscribe((data: any) => {
      //console.log('API data:', data); // Debug: Log API data
      this.blogsAllData = data || []; // Assign data to eventsAllData or fallback to empty array if null/undefined

      // Initialize pagination
      this.totalPages = Math.ceil(this.blogsAllData.length / this.pageSize);
      //console.log('Total pages:', this.totalPages); // Debug: Log total pages
      this.setPage(this.currentPage);
    });
  }

  // Set the page and slice the data for the current page
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages || this.totalPages === 0) {
      return;
    }
    this.currentPage = page;

    // Slice the data for the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEvents = this.blogsAllData.slice(startIndex, endIndex);
    //console.log('Paginated Events:', this.paginatedEvents); // Debug: Log paginated events
  }

  // Go to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  // Go to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  updateMetaTags(): void {
    this.apiService.getNewsMeta().subscribe({
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

          // ================= Open Graph Meta Tags =================
          this.meta.updateTag({
            property: 'og:locale',
            content: 'en_IN',
          });

          this.meta.updateTag({
            property: 'og:type',
            content: 'website',
          });

          this.meta.updateTag({
            property: 'og:title',
            content:
              metaData.Title || 'News & Updates – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Latest news, announcements, achievements, events, and campus updates from Amity University Noida.',
          });

          this.meta.updateTag({
            property: 'og:url',
            content: metaData.CanonicalUrl || window.location.href,
          });

          this.meta.updateTag({
            property: 'og:site_name',
            content: 'Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:image',
            content:
              this.blogsAllData?.length > 0 && this.blogsAllData[0]?.ImageUrl
                ? `https://noida.amity.edu/${this.blogsAllData[0].ImageUrl}`
                : 'https://noida.amity.edu/assets/images/amity-logo.png',
          });

          this.meta.updateTag({
            property: 'og:image:alt',
            content: 'Amity University News & Updates',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content:
              metaData.Title || 'News & Updates – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Latest news, announcements, achievements, events, and campus updates from Amity University Noida.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content:
              this.blogsAllData?.length > 0 && this.blogsAllData[0]?.ImageUrl
                ? `https://noida.amity.edu/${this.blogsAllData[0].ImageUrl}`
                : 'https://noida.amity.edu/assets/images/amity-logo.png',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Amity University News & Updates',
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          // Define and set the canonical URL
          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/news`;

    const articles =
      this.blogsAllData?.slice(0, 10).map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'NewsArticle',
          '@id': `${pageUrl}#news-${index + 1}`,
          headline: item.Title,
          description: item.ShortDescription || item.Description,
          datePublished: item.PublishDate,
          dateModified: item.PublishDate,
          author: {
            '@type': 'Organization',
            name: 'Amity University Noida',
          },
          image: item.ImageUrl
            ? `${baseUrl}/${item.ImageUrl}`
            : `${baseUrl}/assets/images/amity-logo.png`,
          publisher: { '@id': `${baseUrl}#university` },
        },
      })) || [];

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          name: metaData.Title || 'News & Updates – Amity University Noida',
          description:
            metaData.Description ||
            'Latest news, announcements, achievements, events, and campus updates from Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}#university` },
          mainEntity: { '@id': `${pageUrl}#news-list` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        },

        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#news-list`,
          name: 'University News & Announcements',
          itemListOrder: 'https://schema.org/ItemListOrderDescending',
          itemListElement: articles,
        },

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
            'Amity University Noida is a globally recognized institution known for academic excellence, innovation, and research leadership.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201313',
            addressCountry: 'IN',
          },
          sameAs: [
            'https://www.facebook.com/amityuni',
            'https://twitter.com/AmityUni',
            'https://www.instagram.com/amityuniversity/',
            'https://www.linkedin.com/school/amity-university/',
          ],
        },

        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumb`,
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
              name: 'News',
              item: pageUrl,
            },
          ],
        },
      ],
    };

    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

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
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
