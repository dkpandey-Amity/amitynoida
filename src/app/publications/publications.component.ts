import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CleanHtmlPipe } from '../custompipe/clean-html.pipe';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [RouterLink, CleanHtmlPipe],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css',
})
export class PublicationsComponent {
  publicationData: any = [];

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
    this.getPublicationList();
  }

  getPublicationList() {
    this.apiService.getallPublication().subscribe((data: any) => {
      this.publicationData = data;
      console.log(data);
    });
  }

  updateMetaTags(): void {
    this.apiService.getPublicationsMeta().subscribe({
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
            metaData.Title || 'Research Publications – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore research publications, scholarly articles, and academic contributions by faculty at Amity University Noida.';

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
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/publications`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= COLLECTION PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name:
            metaData.Title || 'Research Publications – Amity University Noida',
          description:
            metaData.Description ||
            'Explore peer-reviewed research publications and scholarly articles by Amity University Noida faculty.',
          isPartOf: {
            '@id': `${baseUrl}#website`,
          },
          mainEntity: {
            '@id': `${canonicalUrl}#publications-list`,
          },
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb`,
          },
        },

        /* ================= ITEM LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#publications-list`,
          name: 'Research Publications',
          itemListOrder: 'https://schema.org/ItemListOrderDescending',
          numberOfItems: 2, // 🔁 make dynamic later
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': ['ScholarlyArticle', 'Article', 'CreativeWork'],
                '@id': `${canonicalUrl}/ai-healthcare`,
                name: 'AI Applications in Healthcare',
                headline: 'AI Applications in Healthcare',
                url: `${canonicalUrl}/ai-healthcare`,
                datePublished: '2024-03-12',
                publisher: {
                  '@id': `${baseUrl}#university`,
                },
              },
            },
          ],
        },

        /* ================= SCHOLARLY ARTICLE ================= */
        {
          '@type': ['ScholarlyArticle', 'Article', 'CreativeWork'],
          '@id': `${canonicalUrl}/ai-healthcare`,
          name: 'AI Applications in Healthcare',
          headline: 'AI Applications in Healthcare',
          description:
            'A study on artificial intelligence adoption in modern healthcare systems.',
          datePublished: '2024-03-12',
          inLanguage: 'en',
          author: {
            '@type': 'Person',
            name: 'Dr. Anil Sharma',
            affiliation: {
              '@id': `${baseUrl}#university`,
            },
          },
          publisher: {
            '@id': `${baseUrl}#university`,
          },
          url: `${canonicalUrl}/ai-healthcare`,
          isPartOf: {
            '@id': canonicalUrl,
          },
          mainEntityOfPage: {
            '@id': `${canonicalUrl}/ai-healthcare`,
          },
        },

        /* ================= UNIVERSITY ================= */
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          foundingDate: '2005',
        },

        /* ================= BREADCRUMB ================= */
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
              name: 'Publications',
              item: canonicalUrl,
            },
          ],
        },

        /* ================= WEBSITE ================= */
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          url: baseUrl,
          name: 'Amity University Noida',
          publisher: {
            '@id': `${baseUrl}#university`,
          },
        },
      ],
    };

    // Remove old schema
    const existingScript = document.getElementById('structured-data');
    if (existingScript) existingScript.remove();

    // Inject schema
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
}
