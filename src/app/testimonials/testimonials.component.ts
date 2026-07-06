import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent implements OnInit {
  studentTestimonials: any[] = [];

  ParentsTestimonials: any[] = [];

  AlumniTestimonials: any[] = [];

  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {}

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.updateMetaTags();
    this.getStudentTestimonials();
    this.getAllParentsTestimonials();
    this.getAllAlumniTestimonials();
  }

  getStudentTestimonials() {
    this.apiService.getTestimonials().subscribe({
      next: (data: any) => {
        this.studentTestimonials = data;
      },
      error: (err: any) => {
        console.error('Error fetching testimonials', err);
      },
    });
  }

  getAllParentsTestimonials() {
    this.apiService.getParentsTestimonials().subscribe({
      next: (data: any) => {
        this.ParentsTestimonials = data;
      },
      error: (err: any) => {
        console.log('Error fetching testimonials', err);
      },
    });
  }

  getAllAlumniTestimonials() {
    this.apiService.getAlumniTestimonials().subscribe({
      next: (data: any) => {
        this.AlumniTestimonials = data;
      },
      error: (err: any) => {
        console.log('Error fetching testimonials', err);
      },
    });
  }

  updateMetaTags(): void {
    this.apiService.getTestimonialsMeta().subscribe({
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
            metaData.Title || 'Testimonials – Amity University Noida';

          const description =
            metaData.Description ||
            'Read testimonials from students, parents, and alumni sharing their experiences at Amity University Noida.';

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
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/testimonials`;

    const reviews = [
      ...this.studentTestimonials,
      ...this.ParentsTestimonials,
      ...this.AlumniTestimonials,
    ].slice(0, 5); // limit to avoid over-spam

    const reviewItems = reviews.map((review, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: { '@id': `${canonicalUrl}#review-${index + 1}` },
    }));

    const reviewSchemas = reviews.map((review, index) => ({
      '@type': 'Review',
      '@id': `${canonicalUrl}#review-${index + 1}`,
      reviewBody: review.Testimonial || review.Description || '',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.Rating || '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: review.Name || 'Verified Reviewer',
        affiliation: { '@id': `${baseUrl}#university` },
      },
      itemReviewed: { '@id': `${baseUrl}#university` },
    }));

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PAGE ================= */
        {
          '@type': ['CollectionPage', 'WebPage'],
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Testimonials – Amity University Noida',
          description:
            metaData.Description ||
            'Read testimonials from students, parents, and alumni sharing their experiences at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}#university` },
          mainEntity: { '@id': `${canonicalUrl}#testimonial-list` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb-testimonials` },
        },

        /* ================= ITEM LIST ================= */
        {
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#testimonial-list`,
          name: 'Testimonials',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: reviewItems,
        },

        /* ================= REVIEWS ================= */
        ...reviewSchemas,

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
            'Amity University Noida is a leading private university known for academic excellence, innovation, research, and holistic student development.',
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
            {
              '@type': 'ContactPoint',
              telephone: '0120-4713600',
              email: 'admissions@amity.edu',
              contactType: 'admissions office',
              areaServed: 'Worldwide',
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
          '@id': `${canonicalUrl}#breadcrumb-testimonials`,
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
              name: 'Testimonials',
              item: canonicalUrl,
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
}
