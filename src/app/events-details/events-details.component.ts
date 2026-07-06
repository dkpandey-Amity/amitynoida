import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventpipePipe } from '../custompipe/eventpipe.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-events-details',
  standalone: true,
  imports: [CommonModule, RouterLink, EventpipePipe],
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.css',
})
export class EventsDetailsComponent implements OnInit {
  eventsData: any;
  iEventId!: string;
  SlugName: any;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.SlugName = this.route.snapshot.params['SlugName'];

    this.apiService.getEventDetails(this.SlugName).subscribe((data: any) => {
      this.eventsData = data;

      // Get first object if API returns array
      const event = Array.isArray(data) ? data[0] : data;

      // Dynamic SEO
      this.updateMetaTags(event);

      // Canonical
      this.setCanonicalLink(window.location.href);

      // Schema
      this.injectStructuredData(event);
    });
  }

  updateMetaTags(event: any): void {
    this.apiService.getEventsMeta().subscribe({
      next: (data: any[]) => {
        const metaData = Array.isArray(data) && data.length > 0 ? data[0] : {};

        // ================= EVENT DESCRIPTION =================
        // Generate meta description from sEventDetails only
        const temp = document.createElement('textarea');
        temp.innerHTML = event?.sEventDetails || '';

        const description = temp.value
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 160);

        const pageTitle =
          event?.sEventName ||
          metaData.Title ||
          'Events | Amity University, Noida';

        const keywords =
          metaData.Keywords || `${pageTitle}, Events, Amity University, Noida`;

        const canonicalUrl = window.location.href;

        // ================= BASIC META =================
        this.titleService.setTitle(pageTitle);

        this.meta.updateTag({
          name: 'description',
          content: description,
        });

        this.meta.updateTag({
          name: 'keywords',
          content: keywords,
        });

        this.meta.updateTag({
          name: 'robots',
          content: 'index, follow',
        });

        this.meta.updateTag({
          name: 'author',
          content: 'Amity University Noida',
        });

        this.meta.updateTag({
          name: 'language',
          content: 'English',
        });

        this.meta.updateTag({
          name: 'revisit-after',
          content: '7 days',
        });

        // ================= OPEN GRAPH =================
        this.meta.updateTag({
          property: 'og:locale',
          content: 'en_IN',
        });

        this.meta.updateTag({
          property: 'og:type',
          content: 'event',
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

        if (event?.ImageUrl || event?.sImagePath) {
          const imageUrl = event.ImageUrl
            ? event.ImageUrl.startsWith('http')
              ? event.ImageUrl
              : `https://noida.amity.edu/${event.ImageUrl}`
            : `https://noida.amity.edu/${event.sImagePath}`;

          this.meta.updateTag({
            property: 'og:image',
            content: imageUrl,
          });

          this.meta.updateTag({
            property: 'og:image:secure_url',
            content: imageUrl,
          });

          this.meta.updateTag({
            property: 'og:image:alt',
            content: pageTitle,
          });

          this.meta.updateTag({
            property: 'og:image:type',
            content: 'image/jpeg',
          });
        }

        // ================= TWITTER =================
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

        if (event?.ImageUrl || event?.sImagePath) {
          const imageUrl = event.ImageUrl
            ? event.ImageUrl.startsWith('http')
              ? event.ImageUrl
              : `https://noida.amity.edu/${event.ImageUrl}`
            : `https://noida.amity.edu/${event.sImagePath}`;

          this.meta.updateTag({
            name: 'twitter:image',
            content: imageUrl,
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: pageTitle,
          });
        }

        // ================= CANONICAL =================
        this.setCanonicalLink(canonicalUrl);
      },

      error: (error: any) => {
        console.error('Error fetching event meta:', error);

        const temp = document.createElement('textarea');
        temp.innerHTML = event?.sEventDetails || '';

        const description = temp.value
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 160);

        this.titleService.setTitle(
          event?.sEventName || 'Events | Amity University, Noida',
        );

        this.meta.updateTag({
          name: 'description',
          content: description,
        });

        this.meta.updateTag({
          name: 'keywords',
          content: event?.sEventName || 'Events, Amity University, Noida',
        });

        this.setCanonicalLink(window.location.href);
      },
    });
  }

  injectStructuredData(eventData: any): void {
    const baseUrl = 'https://noida.amity.edu';

    const eventUrl = window.location.href;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Event', 'WebPage'],
          '@id': `${eventUrl}#event`,
          url: eventUrl,
          name: eventData?.EventTitle || 'Event – Amity University Noida',
          description:
            eventData?.EventDescription ||
            'Academic and cultural event hosted by Amity University Noida.',
          startDate: eventData?.StartDate || '2025-01-01T10:00',
          endDate: eventData?.EndDate || '2025-01-01T17:00',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: 'Amity University Noida',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sector 125',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201313',
              addressCountry: 'IN',
            },
          },
          organizer: {
            '@id': `${baseUrl}/#university`,
          },
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          breadcrumb: {
            '@id': `${eventUrl}#breadcrumb`,
          },
        },

        {
          '@type': [
            'CollegeOrUniversity',
            'EducationalOrganization',
            'Organization',
          ],
          '@id': `${baseUrl}/#university`,
          name: 'Amity University Noida',
          url: `${baseUrl}/`,
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
          foundingDate: '2005',
          description:
            'Amity University Noida hosts academic, cultural, and research events for students and scholars.',
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
              email: 'events@amity.edu',
              contactType: 'event information',
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

        {
          '@type': 'BreadcrumbList',
          '@id': `${eventUrl}#breadcrumb`,
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
              name: 'Events',
              item: `${baseUrl}/events`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: eventData?.EventTitle || 'Event Details',
              item: eventUrl,
            },
          ],
        },

        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: 'Amity University Noida',
          publisher: {
            '@id': `${baseUrl}/#university`,
          },
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
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
