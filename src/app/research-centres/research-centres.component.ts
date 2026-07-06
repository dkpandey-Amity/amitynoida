import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-research-centres',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './research-centres.component.html',
  styleUrl: './research-centres.component.css',
})
export class ResearchCentresComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getResearchCentresMeta().subscribe({
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
            metaData.Title || 'Research Centres – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore research centres at Amity University Noida focusing on innovation, interdisciplinary research, artificial intelligence, biotechnology, and scientific advancement.';

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
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/research-centres`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= RESEARCH CENTRES PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Research Centres – Amity University Noida',
          description:
            metaData.Description ||
            'Explore the diverse research centres at Amity University Noida, focusing on innovation, interdisciplinary research, and scientific advancements.',
          isPartOf: {
            '@id': `${baseUrl}#website`,
          },
          breadcrumb: {
            '@id': `${canonicalUrl}#breadcrumb`,
          },
          mainEntity: {
            '@id': `${canonicalUrl}#research-centres-list`,
          },
        },

        /* ================= RESEARCH CENTRES LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#research-centres-list`,
          name: 'Research Centres',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: 2,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': `${canonicalUrl}#centre-ai`,
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@id': `${canonicalUrl}#centre-biotech`,
              },
            },
          ],
        },

        /* ================= INDIVIDUAL CENTRES ================= */
        {
          '@type': 'Organization',
          '@id': `${canonicalUrl}#centre-ai`,
          name: 'Centre for Artificial Intelligence Research',
          description:
            'Dedicated to artificial intelligence, machine learning, and intelligent systems research at Amity University Noida.',
          url: `${canonicalUrl}/ai`,
          parentOrganization: {
            '@id': `${baseUrl}#university`,
          },
        },

        {
          '@type': 'Organization',
          '@id': `${canonicalUrl}#centre-biotech`,
          name: 'Centre for Biotechnology & Molecular Research',
          description:
            'Focuses on biotechnology, molecular biology, and life sciences innovation.',
          url: `${canonicalUrl}/biotech`,
          parentOrganization: {
            '@id': `${baseUrl}#university`,
          },
        },

        /* ================= SAMPLE RESEARCH PROJECT ================= */
        {
          '@type': 'ResearchProject',
          '@id': `${canonicalUrl}#project-sample`,
          name: 'AI for Healthcare Project',
          description:
            'A research project exploring artificial intelligence applications in medical diagnostics.',
          startDate: '2023-01-01',
          url: `${canonicalUrl}/project-sample`,
          provider: {
            '@id': `${baseUrl}#university`,
          },
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
            'Amity University Noida hosts world-class research centres fostering interdisciplinary studies and global collaborations.',
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
              telephone: '+91-XXXXXXXXXX',
              email: 'research@amity.edu',
              contactType: 'research administration',
              areaServed: 'Worldwide',
            },
            {
              '@type': 'ContactPoint',
              telephone: '+91-XXXXXXXXXX',
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
              name: 'Research Centres',
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
