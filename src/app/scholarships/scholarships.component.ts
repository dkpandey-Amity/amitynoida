import { Component, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from '../service/noidaweb.service';

@Component({
  selector: 'app-scholarships',
  standalone: true,
  imports: [],
  templateUrl: './scholarships.component.html',
  styleUrl: './scholarships.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ScholarshipsComponent {
  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  achieverIndex: number = 0;
  testiIndex: number = 0;
  achieverInterval: any;
  testiInterval: any;

  ngOnInit(): void {
    this.updateMetaTags();

    this.achieverInterval = setInterval(() => {
      this.moveAchievers();
    }, 4000);

    this.testiInterval = setInterval(() => {
      this.moveTestimonials();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.achieverInterval);
    clearInterval(this.testiInterval);
  }

  switchTab(id: string, event?: Event): void {
    document.querySelectorAll('.main-tab').forEach((t: any) => {
      t.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach((t: any) => {
      t.classList.remove('active');
    });

    if (event && event.target) {
      (event.target as HTMLElement).classList.add('active');
    }

    const tab = document.getElementById('tab-' + id);
    if (tab) {
      tab.classList.add('active');
    }
  }

  switchSub(parent: string, id: string, event?: Event): void {
    const container = document.getElementById(parent + '-subtabs');
    if (!container) return;

    container.querySelectorAll('.sub-tab').forEach((t: any) => {
      t.classList.remove('active');
    });

    if (event && event.target) {
      (event.target as HTMLElement).classList.add('active');
    }

    const parentEl = document.getElementById('tab-' + parent);
    if (parentEl) {
      parentEl.querySelectorAll('.sub-content').forEach((c: any) => {
        c.classList.remove('active');
      });
    }

    const subContent = document.getElementById(parent + '-' + id);
    if (subContent) {
      subContent.classList.add('active');
    }
  }

  moveAchievers(): void {
    const track: any = document.getElementById('achieversTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.achiever-card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 24;
    const visibleCards = Math.max(
      1,
      Math.floor(track.parentElement.offsetWidth / cardWidth),
    );

    const maxIndex = Math.max(0, cards.length - visibleCards);
    if (maxIndex === 0) return;

    this.achieverIndex++;

    if (this.achieverIndex > maxIndex) {
      this.achieverIndex = 0;
    }

    track.style.transform = `translateX(-${this.achieverIndex * cardWidth}px)`;
    this.updateAchieverDots();
  }

  goToAchiever(index: number): void {
    const track: any = document.getElementById('achieversTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.achiever-card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 24;
    const visibleCards = Math.max(
      1,
      Math.floor(track.parentElement.offsetWidth / cardWidth),
    );

    const maxIndex = Math.max(0, cards.length - visibleCards);
    if (maxIndex === 0) return;

    this.achieverIndex = Math.min(index, maxIndex);
    track.style.transform = `translateX(-${this.achieverIndex * cardWidth}px)`;

    this.updateAchieverDots();
  }

  updateAchieverDots(): void {
    const dotsContainer: any = document.getElementById('achieverDots');
    if (!dotsContainer) return;

    const dots = dotsContainer.children;

    Array.from(dots).forEach((dot: any, i: number) => {
      dot.classList.toggle('active', i === this.achieverIndex);
    });
  }

  moveTestimonials(): void {
    const track: any = document.getElementById('testiTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.testi-card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 24;
    const visibleCards = Math.max(
      1,
      Math.floor(track.parentElement.offsetWidth / cardWidth),
    );

    const maxIndex = Math.max(0, cards.length - visibleCards);
    if (maxIndex === 0) return;

    this.testiIndex++;

    if (this.testiIndex > maxIndex) {
      this.testiIndex = 0;
    }

    track.style.transform = `translateX(-${this.testiIndex * cardWidth}px)`;
  }

  updateMetaTags(): void {
    this.apiService.getScholarshipsMeta().subscribe({
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
            metaData.Title || 'Scholarships – Amity University Noida';

          const description =
            metaData.Description ||
            'Explore scholarships at Amity University Noida including merit-based, sports, need-based, and government scholarship schemes for students.';

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
    const canonicalUrl = metaData.CanonicalUrl || `${baseUrl}/scholarships`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        /* ================= PAGE ================= */
        {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Scholarships – Amity University Noida',
          description:
            metaData.Description ||
            'Discover scholarship opportunities at Amity University Noida including merit-based scholarships, sports scholarships, need-based support, government schemes, and fee waivers.',
          isPartOf: { '@id': `${baseUrl}#university` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
          mainEntity: { '@id': `${canonicalUrl}#financial-aid` },
        },

        /* ================= FINANCIAL PRODUCT ================= */
        {
          '@type': 'FinancialProduct',
          '@id': `${canonicalUrl}#financial-aid`,
          name: 'Amity Scholarship Programs',
          description:
            'A collection of scholarship and financial aid options provided by Amity University Noida for meritorious, deserving, and special-category students.',
          url: canonicalUrl,
          provider: { '@id': `${baseUrl}#university` },
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
            'Amity University Noida offers an extensive range of scholarships supporting academic excellence, sports achievements, and financial assistance for deserving students.',
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
              email: 'scholarships@amity.edu',
              contactType: 'scholarship department',
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

        /* ================= BREADCRUMB ================= */
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
              name: 'Scholarships',
              item: canonicalUrl,
            },
          ],
        },
      ],
    };

    // Remove existing schema
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
