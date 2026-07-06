import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-work-integrated-programs',
  standalone: true,
  imports: [],
  templateUrl: './work-integrated-programs.component.html',
  styleUrl: './work-integrated-programs.component.css'
})
export class WorkIntegratedProgramsComponent {

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getWorkIntegratedProgramsMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {

          const metaData = data[0];

          // ================= BASIC META =================
          this.titleService.setTitle(
            metaData.Title || 'Work Integrated Programs – Amity University Noida'
          );

          this.meta.updateTag({
            name: 'description',
            content: metaData.Description || 'Explore work integrated programs at Amity University Noida designed for professionals to learn while working.'
          });

          this.meta.updateTag({
            name: 'keywords',
            content: metaData.Keywords || 'Work Integrated Programs, Amity University Noida'
          });

          // ================= CANONICAL =================
          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
          this.setCanonicalLink(canonicalUrl);

          // ================= OG + TWITTER =================
          const pageUrl = canonicalUrl;

          const title =
            metaData.Title || 'Work Integrated Programs – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore work integrated programs at Amity University Noida designed for working professionals to upskill and advance their careers.';

          const imageUrl =
            'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

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

          // ================= SCHEMA =================
          this.injectStructuredData(metaData);

        } else {
          console.warn('No meta data received or array is empty.');
        }
      },
      error: (error: any) => {
        console.error('Error fetching meta data from API:', error);
        this.setCanonicalLink(window.location.href);
      }
    });
  }

  injectStructuredData(metaData: any): void {

    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/work-integrated-programs`;

    const schema = {
      "@context": "https://schema.org",
      "@graph": [

        // ===== PAGE =====
        {
          "@type": ["CollectionPage", "WebPage"],
          "@id": canonicalUrl,
          "url": canonicalUrl,
          "name": metaData.Title || "Work Integrated Programs – Amity University Noida",
          "description": metaData.Description || "Explore work integrated programs at Amity University Noida designed for working professionals.",
          "isPartOf": { "@id": `${baseUrl}#university` },
          "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` }
        },

        // ===== PROGRAM LIST =====
        {
          "@type": "ItemList",
          "@id": `${canonicalUrl}#program-list`,
          "name": "Work Integrated Programs",
          "itemListElement": []
        },

        // ===== UNIVERSITY =====
        {
          "@type": ["CollegeOrUniversity", "EducationalOrganization", "Organization"],
          "@id": `${baseUrl}#university`,
          "name": "Amity University Noida",
          "url": baseUrl,
          "logo": `${baseUrl}/assets/images/amity-logo.png`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sector 125",
            "addressLocality": "Noida",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "201313",
            "addressCountry": "IN"
          }
        },

        // ===== BREADCRUMB =====
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": baseUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Work Integrated Programs",
              "item": canonicalUrl
            }
          ]
        }
      ]
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
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}