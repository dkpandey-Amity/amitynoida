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
      const canonicalUrl = `https://noida.amity.edu/events/${this.SlugName}`;

      this.setCanonicalLink(canonicalUrl);

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

        const canonicalUrl = `https://noida.amity.edu/events/${this.SlugName}`;

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

        this.setCanonicalLink(
          `https://noida.amity.edu/events/${this.SlugName}`,
        );
      },
    });
  }

  injectStructuredData(eventData: any): void {
    if (!eventData) {
      return;
    }

    const baseUrl = 'https://noida.amity.edu';
    const homeUrl = `${baseUrl}/`;

    // =====================================================
    // CANONICAL EVENT URL
    // Don't use window.location.href because it may contain
    // UTM/query parameters.
    // =====================================================
    const eventUrl = `${baseUrl}/events/${this.SlugName}`;

    // =====================================================
    // CLEAN HTML
    // =====================================================
    const cleanHtml = (value: any): string => {
      if (!value) {
        return '';
      }

      const temp = document.createElement('textarea');
      temp.innerHTML = value;

      return temp.value
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // =====================================================
    // BASIC EVENT DATA
    // =====================================================
    const eventName =
      eventData?.sEventName || eventData?.EventTitle || eventData?.Title;

    const eventDescription = cleanHtml(
      eventData?.sEventDetails ||
        eventData?.EventDescription ||
        eventData?.Description,
    );

    // =====================================================
    // DATE FORMAT
    // Schema expects ISO-compatible date
    // =====================================================
    const formatSchemaDate = (value: any): string | undefined => {
      if (!value) {
        return undefined;
      }

      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return undefined;
      }

      return date.toISOString().split('T')[0];
    };

    const startDate = formatSchemaDate(
      eventData?.StartDate ||
        eventData?.EventDate ||
        eventData?.dtEventDate ||
        eventData?.sEventDate,
    );

    const endDate =
      formatSchemaDate(
        eventData?.EndDate || eventData?.EventEndDate || eventData?.dtEndDate,
      ) || startDate;

    // =====================================================
    // EVENT STATUS
    // =====================================================
    let eventStatus = 'https://schema.org/EventScheduled';

    if (endDate) {
      const eventEnd = new Date(`${endDate}T23:59:59`);
      const today = new Date();

      if (eventEnd.getTime() < today.getTime()) {
        eventStatus = 'https://schema.org/EventCompleted';
      }
    }

    // =====================================================
    // IMAGE
    // =====================================================
    let imageUrl: string | undefined;

    if (eventData?.ImageUrl) {
      imageUrl = eventData.ImageUrl.startsWith('http')
        ? eventData.ImageUrl
        : `${baseUrl}/${eventData.ImageUrl.replace(/^\/+/, '')}`;
    } else if (eventData?.sImagePath) {
      imageUrl = eventData.sImagePath.startsWith('http')
        ? eventData.sImagePath
        : `${baseUrl}/${eventData.sImagePath.replace(/^\/+/, '')}`;
    }

    // =====================================================
    // 1. COLLEGE / UNIVERSITY
    // =====================================================
    const universitySchema = {
      '@type': 'CollegeOrUniversity',

      '@id': `${homeUrl}#university`,

      name: 'Amity University Noida',

      alternateName: 'Amity University Uttar Pradesh, Noida Campus',

      url: homeUrl,

      address: {
        '@type': 'PostalAddress',

        streetAddress: 'Sector 125',

        addressLocality: 'Noida',

        addressRegion: 'Uttar Pradesh',

        postalCode: '201313',

        addressCountry: 'IN',
      },

      telephone: ['+91-120-2445252', '+91-120-4713600'],
    };

    // =====================================================
    // 2. WEBSITE
    // =====================================================
    const websiteSchema = {
      '@type': 'WebSite',

      '@id': `${homeUrl}#website`,

      url: homeUrl,

      name: 'Amity University Noida',

      publisher: {
        '@id': `${homeUrl}#university`,
      },

      inLanguage: 'en-IN',
    };

    // =====================================================
    // 3. WEBPAGE
    // =====================================================
    const webPageSchema = {
      '@type': 'WebPage',

      '@id': `${eventUrl}#webpage`,

      url: eventUrl,

      name: eventName,

      isPartOf: {
        '@id': `${homeUrl}#website`,
      },

      mainEntity: [
        {
          '@id': `${eventUrl}#event`,
        },
        {
          '@id': `${eventUrl}#article`,
        },
      ],

      breadcrumb: {
        '@id': `${eventUrl}#breadcrumb`,
      },

      inLanguage: 'en-IN',
    };

    // =====================================================
    // 4. EVENT
    // =====================================================
    const eventSchema: any = {
      '@type': 'Event',

      '@id': `${eventUrl}#event`,

      url: eventUrl,

      name: eventName,

      description:
        eventDescription || `${eventName} at Amity University Noida.`,

      eventStatus: eventStatus,

      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',

      location: {
        '@type': 'Place',

        '@id': `${eventUrl}#place`,

        name: 'Amity University, Noida',

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
        '@id': `${homeUrl}#university`,
      },

      mainEntityOfPage: {
        '@id': `${eventUrl}#webpage`,
      },
    };

    if (startDate) {
      eventSchema.startDate = startDate;
    }

    if (endDate) {
      eventSchema.endDate = endDate;
    }

    if (imageUrl) {
      eventSchema.image = imageUrl;
    }

    // =====================================================
    // 5. NEWS ARTICLE
    // =====================================================
    const articleSchema: any = {
      '@type': 'NewsArticle',

      '@id': `${eventUrl}#article`,

      url: eventUrl,

      headline: eventName,

      articleSection: 'Events',

      publisher: {
        '@id': `${homeUrl}#university`,
      },

      about: {
        '@id': `${eventUrl}#event`,
      },

      mainEntityOfPage: {
        '@id': `${eventUrl}#webpage`,
      },

      inLanguage: 'en-IN',
    };

    if (startDate) {
      articleSchema.datePublished = startDate;
    }

    if (eventDescription) {
      articleSchema.description = eventDescription;
    }

    if (imageUrl) {
      articleSchema.image = imageUrl;
    }

    // =====================================================
    // OPTIONAL EXTERNAL ORGANIZATION
    //
    // Map these fields if your API provides them.
    // =====================================================
    const organizationName =
      eventData?.OrganizationName || eventData?.GuestOrganization || '';

    const organizationShortName =
      eventData?.OrganizationShortName ||
      eventData?.OrganizationAlternateName ||
      '';

    const organizationUrl = eventData?.OrganizationUrl || '';

    let organizationSchema: any = null;

    if (organizationName) {
      organizationSchema = {
        '@type': 'Organization',

        '@id': `${eventUrl}#guest-organization`,

        name: cleanHtml(organizationName),
      };

      if (organizationShortName) {
        organizationSchema.alternateName = cleanHtml(organizationShortName);
      }

      if (organizationUrl) {
        organizationSchema.url = organizationUrl;
      }
    }

    // =====================================================
    // OPTIONAL ATTENDEES / PEOPLE
    //
    // This supports your reference structure.
    // Map actual API properties when available.
    // =====================================================
    const people: any[] = [];

    const addPerson = (
      name: any,
      jobTitle: any,
      id: string,
      worksForUniversity = false,
    ) => {
      if (!name) {
        return;
      }

      const person: any = {
        '@type': 'Person',

        '@id': `${eventUrl}#${id}`,

        name: cleanHtml(name),
      };

      if (jobTitle) {
        person.jobTitle = cleanHtml(jobTitle);
      }

      if (worksForUniversity) {
        person.worksFor = {
          '@id': `${homeUrl}#university`,
        };
      } else if (organizationSchema) {
        person.worksFor = {
          '@id': `${eventUrl}#guest-organization`,
        };
      }

      people.push(person);
    };

    // -----------------------------------------------------
    // API FIELD MAPPING
    // Change property names according to your actual API.
    // -----------------------------------------------------
    addPerson(eventData?.GuestName1, eventData?.GuestDesignation1, 'guest-1');

    addPerson(eventData?.GuestName2, eventData?.GuestDesignation2, 'guest-2');

    addPerson(
      eventData?.AmityPersonName,
      eventData?.AmityPersonDesignation,
      'amity-representative',
      true,
    );

    // =====================================================
    // EVENT ATTENDEE REFERENCES
    // =====================================================
    const attendees: any[] = [];

    if (organizationSchema) {
      attendees.push({
        '@id': `${eventUrl}#guest-organization`,
      });
    }

    people.forEach((person) => {
      attendees.push({
        '@id': person['@id'],
      });
    });

    if (attendees.length) {
      eventSchema.attendee = attendees;
    }

    // =====================================================
    // 6. BREADCRUMB
    // =====================================================
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',

      '@id': `${eventUrl}#breadcrumb`,

      itemListElement: [
        {
          '@type': 'ListItem',

          position: 1,

          name: 'Home',

          item: homeUrl,
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

          name: eventName,

          item: eventUrl,
        },
      ],
    };

    // =====================================================
    // BUILD GRAPH
    // =====================================================
    const graph: any[] = [
      universitySchema,

      websiteSchema,

      webPageSchema,

      eventSchema,

      articleSchema,
    ];

    // External organization
    if (organizationSchema) {
      graph.push(organizationSchema);
    }

    // People
    people.forEach((person) => {
      graph.push(person);
    });

    // Breadcrumb
    graph.push(breadcrumbSchema);

    // =====================================================
    // FINAL JSON-LD
    // =====================================================
    const schema = {
      '@context': 'https://schema.org',

      '@graph': graph,
    };

    // =====================================================
    // REMOVE PREVIOUS SCHEMA
    // =====================================================
    const existingScript = document.getElementById('structured-data');

    if (existingScript) {
      existingScript.remove();
    }

    // =====================================================
    // CREATE SCRIPT
    // =====================================================
    const script = document.createElement('script');

    script.type = 'application/ld+json';

    script.id = 'structured-data';

    script.text = JSON.stringify(schema);

    // =====================================================
    // ADD TO HEAD
    // =====================================================
    document.head.appendChild(script);
  }

  // injectStructuredData(eventData: any): void {
  //   const baseUrl = 'https://noida.amity.edu';

  //   const eventUrl = window.location.href;

  //   const schema = {
  //     '@context': 'https://schema.org',
  //     '@graph': [
  //       {
  //         '@type': ['Event', 'WebPage'],
  //         '@id': `${eventUrl}#event`,
  //         url: eventUrl,
  //         name: eventData?.EventTitle || 'Event – Amity University Noida',
  //         description:
  //           eventData?.EventDescription ||
  //           'Academic and cultural event hosted by Amity University Noida.',
  //         startDate: eventData?.StartDate || '2025-01-01T10:00',
  //         endDate: eventData?.EndDate || '2025-01-01T17:00',
  //         eventStatus: 'https://schema.org/EventScheduled',
  //         eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  //         location: {
  //           '@type': 'Place',
  //           name: 'Amity University Noida',
  //           address: {
  //             '@type': 'PostalAddress',
  //             streetAddress: 'Sector 125',
  //             addressLocality: 'Noida',
  //             addressRegion: 'Uttar Pradesh',
  //             postalCode: '201313',
  //             addressCountry: 'IN',
  //           },
  //         },
  //         organizer: {
  //           '@id': `${baseUrl}/#university`,
  //         },
  //         isPartOf: {
  //           '@id': `${baseUrl}/#website`,
  //         },
  //         breadcrumb: {
  //           '@id': `${eventUrl}#breadcrumb`,
  //         },
  //       },

  //       {
  //         '@type': [
  //           'CollegeOrUniversity',
  //           'EducationalOrganization',
  //           'Organization',
  //         ],
  //         '@id': `${baseUrl}/#university`,
  //         name: 'Amity University Noida',
  //         url: `${baseUrl}/`,
  //         logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
  //         foundingDate: '2005',
  //         description:
  //           'Amity University Noida hosts academic, cultural, and research events for students and scholars.',
  //         address: {
  //           '@type': 'PostalAddress',
  //           streetAddress: 'Sector 125',
  //           addressLocality: 'Noida',
  //           addressRegion: 'Uttar Pradesh',
  //           postalCode: '201313',
  //           addressCountry: 'IN',
  //         },
  //         contactPoint: [
  //           {
  //             '@type': 'ContactPoint',
  //             telephone: '0120-2445252',
  //             email: 'info@amity.edu',
  //             contactType: 'general inquiries',
  //             areaServed: 'IN',
  //           },
  //           {
  //             '@type': 'ContactPoint',
  //             telephone: '0120-4713600',
  //             email: 'events@amity.edu',
  //             contactType: 'event information',
  //             areaServed: 'Worldwide',
  //           },
  //         ],
  //         sameAs: [
  //           'https://www.facebook.com/amityuni',
  //           'https://twitter.com/AmityUni',
  //           'https://www.instagram.com/amityuniversity/',
  //           'https://www.linkedin.com/school/amity-university/',
  //         ],
  //       },

  //       {
  //         '@type': 'BreadcrumbList',
  //         '@id': `${eventUrl}#breadcrumb`,
  //         itemListElement: [
  //           {
  //             '@type': 'ListItem',
  //             position: 1,
  //             name: 'Home',
  //             item: `${baseUrl}/`,
  //           },
  //           {
  //             '@type': 'ListItem',
  //             position: 2,
  //             name: 'Events',
  //             item: `${baseUrl}/events`,
  //           },
  //           {
  //             '@type': 'ListItem',
  //             position: 3,
  //             name: eventData?.EventTitle || 'Event Details',
  //             item: eventUrl,
  //           },
  //         ],
  //       },

  //       {
  //         '@type': 'WebSite',
  //         '@id': `${baseUrl}/#website`,
  //         url: `${baseUrl}/`,
  //         name: 'Amity University Noida',
  //         publisher: {
  //           '@id': `${baseUrl}/#university`,
  //         },
  //         logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
  //       },
  //     ],
  //   };

  //   const existingScript = document.getElementById('structured-data');
  //   if (existingScript) {
  //     existingScript.remove();
  //   }

  //   const script = document.createElement('script');
  //   script.type = 'application/ld+json';
  //   script.id = 'structured-data';
  //   script.text = JSON.stringify(schema);
  //   document.head.appendChild(script);
  // }

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
