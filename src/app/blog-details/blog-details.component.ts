import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { EventpipePipe } from '../custompipe/eventpipe.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [RouterLink, EventpipePipe],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css',
})
export class BlogDetailsComponent {
  blogsData: any;
  Id!: string;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.Id = this.route.snapshot.params['Id'];

    this.apiService.getBlogDetails(this.Id).subscribe((data: any) => {
      this.blogsData = data; // Keep array for HTML

      const blog = Array.isArray(data) ? data[0] : data;

      this.updateMetaTags(blog);
      this.injectStructuredData(blog);
    });
  }

  updateMetaTags(blog: any): void {
  this.apiService.getNewsMeta().subscribe({
    next: (data: any[]) => {
      const metaData =
        Array.isArray(data) && data.length > 0 ? data[0] : {};

      // Dynamic values
      const pageTitle =
        blog?.Title ||
        metaData.Title ||
        'Amity University, Noida';

      const description =
        blog?.ShortDescription ||
        blog?.Description ||
        metaData.Description ||
        'Amity University, Noida';

      const keywords =
        metaData.Keywords || 'Amity University, Noida';

      const canonicalUrl =
        metaData.CanonicalUrl || window.location.href;

      // ================= Basic Meta =================
      this.titleService.setTitle(pageTitle);

      this.meta.updateTag({
        name: 'description',
        content: description,
      });

      this.meta.updateTag({
        name: 'keywords',
        content: keywords,
      });

      // ================= Open Graph =================
      this.meta.updateTag({
        property: 'og:locale',
        content: 'en_IN',
      });

      this.meta.updateTag({
        property: 'og:type',
        content: 'article',
      });

      this.meta.updateTag({
        property: 'og:title',
        content: pageTitle,
      });

      this.meta.updateTag({
        property: 'og:description',
        content: description,
      });

      this.meta.updateTag({
        property: 'og:url',
        content: canonicalUrl,
      });

      this.meta.updateTag({
        property: 'og:site_name',
        content: 'Amity University Noida',
      });

      if (blog?.ImageUrl) {
        const imageUrl = blog.ImageUrl.startsWith('http')
          ? blog.ImageUrl
          : `https://noida.amity.edu/${blog.ImageUrl}`;

        this.meta.updateTag({
          property: 'og:image',
          content: imageUrl,
        });

        this.meta.updateTag({
          name: 'twitter:image',
          content: imageUrl,
        });
      }

      // ================= Twitter =================
      this.meta.updateTag({
        name: 'twitter:card',
        content: 'summary_large_image',
      });

      this.meta.updateTag({
        name: 'twitter:title',
        content: pageTitle,
      });

      this.meta.updateTag({
        name: 'twitter:description',
        content: description,
      });

      this.meta.updateTag({
        name: 'twitter:site',
        content: '@AmityUni',
      });

      this.meta.updateTag({
        name: 'twitter:creator',
        content: '@AmityUni',
      });

      // ================= Canonical =================
      this.setCanonicalLink(canonicalUrl);
    },
    error: (error: any) => {
      console.error('Error fetching meta data:', error);

      // Fallback to blog data
      this.titleService.setTitle(blog?.Title || 'Amity University, Noida');

      this.meta.updateTag({
        name: 'description',
        content:
          blog?.ShortDescription ||
          blog?.Description ||
          'Amity University, Noida',
      });

      this.setCanonicalLink(window.location.href);
    },
  });
}


  // ngOnInit(): void {
  //   this.updateMetaTags();
  //   this.Id = this.route.snapshot.params['Id'];

  //   this.apiService.getBlogDetails(this.Id).subscribe((data: any) => {
  //     this.blogsData = data;
  //   });
  // }

  // updateMetaTags(): void {
  //   this.apiService.getNewsMeta().subscribe({
  //     next: (data: any[]) => {
  //       if (Array.isArray(data) && data.length > 0) {
  //         // Assuming you want to use the first item in the array
  //         const metaData = data[0];

  //         // Update meta tags dynamically after data is fetched
  //         this.titleService.setTitle(
  //           metaData.Title || 'Amity University, Noida',
  //         );
  //         this.meta.updateTag({
  //           name: 'description',
  //           content: metaData.Description || 'Amity University, Noida',
  //         });
  //         this.meta.updateTag({
  //           name: 'keywords',
  //           content: metaData.Keywords || 'Amity University, Noida',
  //         });

  //         // ================= Open Graph Meta Tags =================
  //         this.meta.updateTag({
  //           property: 'og:locale',
  //           content: 'en_IN',
  //         });

  //         this.meta.updateTag({
  //           property: 'og:type',
  //           content: 'article',
  //         });

  //         this.meta.updateTag({
  //           property: 'og:title',
  //           content: metaData.Title || 'News – Amity University Noida',
  //         });

  //         this.meta.updateTag({
  //           property: 'og:description',
  //           content:
  //             metaData.Description ||
  //             'Latest updates from Amity University Noida.',
  //         });

  //         this.meta.updateTag({
  //           property: 'og:url',
  //           content: metaData.CanonicalUrl || window.location.href,
  //         });

  //         this.meta.updateTag({
  //           property: 'og:site_name',
  //           content: 'Amity University Noida',
  //         });

  //         // ================= Twitter (X) =================
  //         this.meta.updateTag({
  //           name: 'twitter:card',
  //           content: 'summary_large_image',
  //         });

  //         this.meta.updateTag({
  //           name: 'twitter:title',
  //           content: metaData.Title || 'News – Amity University Noida',
  //         });

  //         this.meta.updateTag({
  //           name: 'twitter:description',
  //           content:
  //             metaData.Description ||
  //             'Latest updates from Amity University Noida.',
  //         });

  //         this.meta.updateTag({
  //           name: 'twitter:site',
  //           content: '@AmityUni',
  //         });

  //         this.meta.updateTag({
  //           name: 'twitter:creator',
  //           content: '@AmityUni',
  //         });

  //         // Define and set the canonical URL
  //         const canonicalUrl = metaData.CanonicalUrl || window.location.href;
  //         this.setCanonicalLink(canonicalUrl);
  //         // Call function to inject structured schema
  //         this.injectStructuredData(metaData);
  //       } else {
  //         console.warn('No meta data received or array is empty.');
  //       }
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching meta data from API:', error);
  //       this.setCanonicalLink(window.location.href);
  //     },
  //   });
  // }

  injectStructuredData(metaData: any): void {
    if (!this.blogsData) return;

    const baseUrl = 'https://noida.amity.edu';
    const pageUrl = metaData.CanonicalUrl || window.location.href;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['NewsArticle', 'WebPage'],
          '@id': pageUrl,
          url: pageUrl,
          headline: this.blogsData.Title,
          description:
            this.blogsData.ShortDescription || this.blogsData.Description,
          articleSection: this.blogsData.Category || 'news',
          datePublished: this.blogsData.PublishDate,
          dateModified: this.blogsData.PublishDate,
          image: this.blogsData.ImageUrl
            ? `${baseUrl}/${this.blogsData.ImageUrl}`
            : `${baseUrl}/assets/images/amity-logo.png`,
          author: {
            '@type': 'Organization',
            name: 'Amity University Noida',
            url: baseUrl,
          },
          publisher: { '@id': `${baseUrl}#university` },
          isPartOf: { '@id': `${baseUrl}#university` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
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
            'Amity University Noida publishes the latest campus news, achievements, innovations, and institutional updates.',
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
              email: 'media@amity.edu',
              contactType: 'media inquiries',
              areaServed: 'Worldwide',
            },
            {
              '@type': 'ContactPoint',
              telephone: '0120-4713600',
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
              item: `${baseUrl}/news`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.blogsData.Category || 'Article',
              item: `${baseUrl}/news/${this.blogsData.Category || 'article'}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: this.blogsData.Title,
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
}
