import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../service/noidaweb.service';

interface FaqItem {
  SNo: number;
  Question: string;
  Answer: string;
  Active: boolean;

  ImagePath?: string;
  FullName?: string;
  ShortName?: string;
  details?: string;
  CategoryName?: string;
  SubCategoryName?: string;
  Title?: string;
  PublicationsDescription?: string;
  CoverImagePath?: string;
  LogoImagePath?: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent implements OnInit {
  // ================= FAQ Variables =================

  faqList: FaqItem[] = [];

  filteredFaqList: FaqItem[] = [];

  searchText: string = '';

  isLoading: boolean = true;

  errorMessage: string = '';

  // ================= SEO Variables =================

  private metaData: any = null;

  private readonly isBrowser: boolean;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,

    @Inject(PLATFORM_ID)
    private platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Load FAQ data
    this.loadFaq();

    // Load SEO meta data
    this.updateMetaTags();
  }

  // =================================================
  // LOAD FAQ DATA
  // =================================================

  loadFaq(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.apiService.getAllFaq().subscribe({
      next: (response: any) => {
        console.log('Complete FAQ API Response:', response);

        /*
         * Supports different API response formats:
         *
         * Direct:
         * [
         *   {
         *     Question: '',
         *     Answer: ''
         *   }
         * ]
         *
         * Value:
         * {
         *   Value: []
         * }
         *
         * Data:
         * {
         *   Data: []
         * }
         */

        const faqData: FaqItem[] = Array.isArray(response)
          ? response
          : response?.Value ||
            response?.Data ||
            response?.data ||
            response?.Result ||
            [];

        console.log('FAQ Data:', faqData);

        // Show only active FAQs
        // and sort using SNo

        this.faqList = faqData

          .filter(
            (faq: FaqItem) =>
              faq.Active === true ||
              faq.Active === null ||
              faq.Active === undefined,
          )

          .sort(
            (firstFaq: FaqItem, secondFaq: FaqItem) =>
              Number(firstFaq.SNo) - Number(secondFaq.SNo),
          );

        // Create separate array for search

        this.filteredFaqList = [...this.faqList];

        console.log('Final FAQ List:', this.faqList);

        this.isLoading = false;

        /*
         * Update FAQ structured data
         * after API FAQs are loaded.
         */

        this.updateStructuredData();
      },

      error: (error: any) => {
        console.error('FAQ API Error:', error);

        this.errorMessage = 'Unable to load FAQs. Please try again later.';

        this.isLoading = false;
      },
    });
  }

  // =================================================
  // FAQ SEARCH
  // =================================================

  onSearch(): void {
    const searchValue = this.searchText

      .toLowerCase()

      .trim();

    /*
     * If search box is empty,
     * show all FAQs.
     */

    if (!searchValue) {
      this.filteredFaqList = [...this.faqList];

      return;
    }

    /*
     * Search inside:
     *
     * Question
     * Answer
     * Category
     * Subcategory
     */

    this.filteredFaqList = this.faqList.filter((faq: FaqItem) => {
      const question = faq.Question?.toLowerCase() || '';

      /*
       * Remove HTML tags from answer
       * before searching.
       */

      const answer = this.removeHtmlTags(faq.Answer)

        .toLowerCase();

      const category = faq.CategoryName?.toLowerCase() || '';

      const subCategory = faq.SubCategoryName?.toLowerCase() || '';

      return (
        question.includes(searchValue) ||
        answer.includes(searchValue) ||
        category.includes(searchValue) ||
        subCategory.includes(searchValue)
      );
    });
  }

  // =================================================
  // CLEAR SEARCH
  // =================================================

  clearSearch(): void {
    this.searchText = '';

    this.filteredFaqList = [...this.faqList];
  }

  // =================================================
  // REMOVE HTML TAGS
  // =================================================

  private removeHtmlTags(html: string): string {
    if (!html) {
      return '';
    }

    return html

      .replace(
        /<[^>]*>/g,

        ' ',
      )

      .replace(
        /&nbsp;/g,

        ' ',
      )

      .replace(
        /\s+/g,

        ' ',
      )

      .trim();
  }

  // =================================================
  // UPDATE SEO META TAGS
  // =================================================

  updateMetaTags(): void {
    this.apiService

      .getfaqMeta()

      .subscribe({
        next: (data: any[]) => {
          if (Array.isArray(data) && data.length > 0) {
            this.metaData = data[0];

            const metaData = this.metaData;

            const title = metaData.Title || 'FAQ – Amity University Noida';

            const description =
              metaData.Description ||
              'Find answers to frequently asked questions about admissions, programs, placements, fees, and campus life at Amity University Noida.';

            const canonicalUrl =
              metaData.CanonicalUrl || 'https://noida.amity.edu/faq';

            // ================= Title =================

            this.titleService.setTitle(title);

            // ================= Description =================

            this.meta.updateTag({
              name: 'description',

              content: description,
            });

            // ================= Keywords =================

            this.meta.updateTag({
              name: 'keywords',

              content: metaData.Keywords || 'Amity University Noida FAQ',
            });

            // ================= Open Graph =================

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

              content: title,
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

            this.meta.updateTag({
              property: 'og:image',

              content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
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

              content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
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

            // ================= Canonical =================

            this.setCanonicalLink(canonicalUrl);

            /*
             * Generate schema.
             *
             * If FAQs are already loaded,
             * dynamic FAQ questions will
             * automatically be included.
             */

            this.updateStructuredData();
          } else {
            console.warn('No FAQ meta data received.');

            this.setCanonicalLink('https://noida.amity.edu/faq');
          }
        },

        error: (error: any) => {
          console.error(
            'FAQ Meta API Error:',

            error,
          );

          this.setCanonicalLink('https://noida.amity.edu/faq');

          this.updateStructuredData();
        },
      });
  }

  // =================================================
  // UPDATE STRUCTURED DATA
  // =================================================

  private updateStructuredData(): void {
    /*
     * document is not available
     * during Angular SSR.
     */

    if (!this.isBrowser) {
      return;
    }

    this.injectStructuredData(this.metaData || {});
  }

  // =================================================
  // DYNAMIC FAQ SCHEMA
  // =================================================

  injectStructuredData(metaData: any): void {
    if (!this.isBrowser) {
      return;
    }

    const baseUrl = 'https://noida.amity.edu';

    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/faq`;

    /*
     * Generate Question schema
     * dynamically from API.
     */

    const faqSchema = this.faqList.map(
      (
        faq: FaqItem,

        index: number,
      ) => {
        return {
          '@type': 'Question',

          '@id': `${pageUrl}#faq-question-${faq.SNo || index + 1}`,

          name: this.removeHtmlTags(faq.Question),

          acceptedAnswer: {
            '@type': 'Answer',

            text: this.removeHtmlTags(faq.Answer),
          },
        };
      },
    );

    const schema = {
      '@context': 'https://schema.org',

      '@graph': [
        // ================= FAQ Page =================

        {
          '@type': ['FAQPage', 'WebPage'],

          '@id': pageUrl,

          url: pageUrl,

          name:
            metaData.Title ||
            'Frequently Asked Questions – Amity University Noida',

          description:
            metaData.Description ||
            'Find answers to frequently asked questions about admissions, programs, placements, fees, and campus life at Amity University Noida.',

          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },

          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },

          /*
           * All API FAQs will be
           * automatically added here.
           */

          mainEntity: faqSchema,
        },

        // ================= Website =================

        {
          '@type': 'WebSite',

          '@id': `${baseUrl}/#website`,

          url: baseUrl,

          name: 'Amity University Noida',

          publisher: {
            '@id': `${baseUrl}/#university`,
          },

          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
        },

        // ================= University =================

        {
          '@type': [
            'CollegeOrUniversity',

            'EducationalOrganization',

            'Organization',
          ],

          '@id': `${baseUrl}/#university`,

          name: 'Amity University Noida',

          url: baseUrl,

          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',

          foundingDate: '2005',

          description:
            "Amity University Noida is one of India's leading private universities offering world-class education and modern infrastructure.",

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

              contactType: 'admissions',

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

        // ================= Breadcrumb =================

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

              name: 'FAQ',

              item: pageUrl,
            },
          ],
        },
      ],
    };

    // Remove previous schema

    const existingScript = document.getElementById('structured-data');

    if (existingScript) {
      existingScript.remove();
    }

    // Add updated schema

    const script = document.createElement('script');

    script.type = 'application/ld+json';

    script.id = 'structured-data';

    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  // =================================================
  // CANONICAL URL
  // =================================================

  private setCanonicalLink(url: string): void {
    if (!this.isBrowser) {
      return;
    }

    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]',
    );

    if (!link) {
      link = document.createElement('link');

      link.setAttribute(
        'rel',

        'canonical',
      );

      document.head.appendChild(link);
    }

    link.setAttribute(
      'href',

      url,
    );
  }
}

// import { Component } from '@angular/core';
// import { Meta, Title } from '@angular/platform-browser';
// import { RouterLink } from '@angular/router';
// import { ApiService } from '../service/noidaweb.service';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-faq',
//   standalone: true,
//   imports: [RouterLink, FormsModule],
//   templateUrl: './faq.component.html',
//   styleUrl: './faq.component.css',
// })
// export class FaqComponent {
//   searchText: string = '';

//   constructor(
//     private meta: Meta,
//     private titleService: Title,
//     private apiService: ApiService,
//   ) {}

//   ngOnInit(): void {
//     this.updateMetaTags();
//   }

//   onSearch(event: Event): void {
//     const value = (event.target as HTMLInputElement).value.toLowerCase();

//     const cards = document.querySelectorAll('.accordion-card');

//     cards.forEach((card: any) => {
//       const text = card.innerText.toLowerCase();

//       if (text.includes(value)) {
//         card.style.display = '';
//       } else {
//         card.style.display = 'none';
//       }
//     });
//   }

//   updateMetaTags(): void {
//     this.apiService.getfaqMeta().subscribe({
//       next: (data: any[]) => {
//         if (Array.isArray(data) && data.length > 0) {
//           // Assuming you want to use the first item in the array
//           const metaData = data[0];

//           // Update meta tags dynamically after data is fetched
//           this.titleService.setTitle(
//             metaData.Title || 'Amity University, Noida',
//           );
//           this.meta.updateTag({
//             name: 'description',
//             content: metaData.Description || 'Amity University, Noida',
//           });
//           this.meta.updateTag({
//             name: 'keywords',
//             content: metaData.Keywords || 'Amity University, Noida',
//           });

//           // ================= Open Graph Meta Tags =================
//           this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

//           this.meta.updateTag({ property: 'og:type', content: 'website' });

//           this.meta.updateTag({
//             property: 'og:title',
//             content: metaData.Title || 'FAQ – Amity University Noida',
//           });

//           this.meta.updateTag({
//             property: 'og:description',
//             content:
//               metaData.Description ||
//               'Find answers to frequently asked questions about admissions, programs, placements, fees, and campus life at Amity University Noida.',
//           });

//           this.meta.updateTag({
//             property: 'og:url',
//             content: metaData.CanonicalUrl || window.location.href,
//           });

//           this.meta.updateTag({
//             property: 'og:site_name',
//             content: 'Amity University Noida',
//           });

//           this.meta.updateTag({
//             property: 'og:image',
//             content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
//           });

//           this.meta.updateTag({
//             property: 'og:image:alt',
//             content: 'FAQ – Amity University Noida',
//           });

//           // ================= Twitter (X) Meta Tags =================
//           this.meta.updateTag({
//             name: 'twitter:card',
//             content: 'summary_large_image',
//           });

//           this.meta.updateTag({
//             name: 'twitter:title',
//             content: metaData.Title || 'FAQ – Amity University Noida',
//           });

//           this.meta.updateTag({
//             name: 'twitter:description',
//             content:
//               metaData.Description ||
//               'Find answers to frequently asked questions about admissions, programs, placements, fees, and campus life at Amity University Noida.',
//           });

//           this.meta.updateTag({
//             name: 'twitter:image',
//             content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
//           });

//           this.meta.updateTag({
//             name: 'twitter:image:alt',
//             content: 'FAQ – Amity University Noida',
//           });

//           this.meta.updateTag({
//             name: 'twitter:site',
//             content: '@AmityUni',
//           });

//           this.meta.updateTag({
//             name: 'twitter:creator',
//             content: '@AmityUni',
//           });

//           // Define and set the canonical URL
//           const canonicalUrl = metaData.CanonicalUrl || window.location.href;
//           this.setCanonicalLink(canonicalUrl);

//           // Call function to inject structured schema
//           this.injectStructuredData(metaData);
//         } else {
//           console.warn('No meta data received or array is empty.');
//         }
//       },
//       error: (error: any) => {
//         console.error('Error fetching meta data from API:', error);
//         this.setCanonicalLink(window.location.href);
//       },
//     });
//   }

//   injectStructuredData(metaData: any): void {
//     const baseUrl = 'https://noida.amity.edu';
//     const pageUrl = metaData.CanonicalUrl || `${baseUrl}/faq`;

//     const schema = {
//       '@context': 'https://schema.org',
//       '@graph': [
//         {
//           '@type': ['FAQPage', 'WebPage'],
//           '@id': pageUrl,
//           url: pageUrl,
//           name:
//             metaData.Title ||
//             'Frequently Asked Questions – Amity University Noida',
//           description:
//             metaData.Description ||
//             'Find answers to frequently asked questions about admissions, programs, placements, fees, and campus life at Amity University Noida.',
//           isPartOf: { '@id': `${baseUrl}/#website` },
//           breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
//           mainEntity: [
//             {
//               '@type': 'Question',
//               '@id': `${pageUrl}#faq-q1`,
//               name: 'What programs does Amity University Noida offer?',
//               acceptedAnswer: {
//                 '@type': 'Answer',
//                 text: 'Amity University Noida offers undergraduate, postgraduate, doctoral, and international programs across various disciplines.',
//               },
//             },
//             {
//               '@type': 'Question',
//               '@id': `${pageUrl}#faq-q2`,
//               name: 'What is the admission process?',
//               acceptedAnswer: {
//                 '@type': 'Answer',
//                 text: 'The admission process includes an application submission, entrance exam (if applicable), and a personal interview.',
//               },
//             },
//           ],
//         },

//         {
//           '@type': 'WebSite',
//           '@id': `${baseUrl}/#website`,
//           url: baseUrl,
//           name: 'Amity University Noida',
//           publisher: { '@id': `${baseUrl}/#university` },
//           logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
//         },

//         {
//           '@type': [
//             'CollegeOrUniversity',
//             'EducationalOrganization',
//             'Organization',
//           ],
//           '@id': `${baseUrl}/#university`,
//           name: 'Amity University Noida',
//           url: baseUrl,
//           logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
//           foundingDate: '2005',
//           description:
//             "Amity University Noida is one of India's leading private universities offering world-class education and modern infrastructure.",
//           address: {
//             '@type': 'PostalAddress',
//             streetAddress: 'Sector 125',
//             addressLocality: 'Noida',
//             addressRegion: 'Uttar Pradesh',
//             postalCode: '201313',
//             addressCountry: 'IN',
//           },
//           contactPoint: [
//             {
//               '@type': 'ContactPoint',
//               telephone: '0120-2445252',
//               email: 'info@amity.edu',
//               contactType: 'general inquiries',
//               areaServed: 'IN',
//             },
//             {
//               '@type': 'ContactPoint',
//               telephone: '0120-4713600',
//               email: 'admissions@amity.edu',
//               contactType: 'admissions',
//               areaServed: 'Worldwide',
//             },
//           ],
//           sameAs: [
//             'https://www.facebook.com/amityuni',
//             'https://twitter.com/AmityUni',
//             'https://www.instagram.com/amityuniversity/',
//             'https://www.linkedin.com/school/amity-university/',
//           ],
//         },

//         {
//           '@type': 'BreadcrumbList',
//           '@id': `${pageUrl}#breadcrumb`,
//           itemListElement: [
//             {
//               '@type': 'ListItem',
//               position: 1,
//               name: 'Home',
//               item: `${baseUrl}/`,
//             },
//             {
//               '@type': 'ListItem',
//               position: 2,
//               name: 'FAQ',
//               item: pageUrl,
//             },
//           ],
//         },
//       ],
//     };

//     const existingScript = document.getElementById('structured-data');
//     if (existingScript) {
//       existingScript.remove();
//     }

//     const script = document.createElement('script');
//     script.type = 'application/ld+json';
//     script.id = 'structured-data';
//     script.text = JSON.stringify(schema);
//     document.head.appendChild(script);
//   }

//   private setCanonicalLink(url: string): void {
//     // Attempt to find an existing canonical link
//     let link: HTMLLinkElement | null = document.querySelector(
//       'link[rel="canonical"]',
//     );

//     if (!link) {
//       // If not found, create a new canonical link element
//       link = document.createElement('link');
//       link.setAttribute('rel', 'canonical');
//       document.head.appendChild(link);
//     }

//     // Set the href attribute
//     link.setAttribute('href', url);
//   }
// }
