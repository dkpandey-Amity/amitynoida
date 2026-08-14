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
        const metaData = Array.isArray(data) && data.length > 0 ? data[0] : {};

        // Dynamic values
        const pageTitle =
          blog?.Title || metaData.Title || 'Amity University, Noida';

        const description =
          blog?.ShortDescription ||
          blog?.Description ||
          metaData.Description ||
          'Amity University, Noida';

        const keywords = metaData.Keywords || 'Amity University, Noida';

        const canonicalUrl = metaData.CanonicalUrl || window.location.href;

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

  injectStructuredData(blog: any): void {
    if (!blog) {
      return;
    }

    const baseUrl = 'https://noida.amity.edu';

    // =====================================================
    // PAGE URL
    // =====================================================
    const currentPath = window.location.pathname;

    const pageUrl = `${baseUrl}${currentPath}`;

    // =====================================================
    // BASIC ARTICLE DATA
    // =====================================================
    const title = blog?.Title || 'Amity University Noida News';

    const description = blog?.ShortDescription || blog?.Description || '';

    const articleSection = blog?.Category || 'News';

    // =====================================================
    // DATE
    // Convert API date to YYYY-MM-DD
    // =====================================================
    const formatSchemaDate = (dateValue: any): string | undefined => {
      if (!dateValue) {
        return undefined;
      }

      const date = new Date(dateValue);

      if (isNaN(date.getTime())) {
        return undefined;
      }

      return date.toISOString().split('T')[0];
    };

    const publishedDate = formatSchemaDate(
      blog?.PublishDate || blog?.PublishedDate || blog?.NewsDate,
    );

    const modifiedDate = formatSchemaDate(
      blog?.ModifiedDate || blog?.UpdatedDate || blog?.PublishDate,
    );

    // =====================================================
    // IMAGE
    // =====================================================
    let imageUrl: string | undefined;

    if (blog?.ImageUrl) {
      imageUrl = blog.ImageUrl.startsWith('http')
        ? blog.ImageUrl
        : `${baseUrl}/${blog.ImageUrl.replace(/^\/+/, '')}`;
    }

    // =====================================================
    // UNIVERSITY
    // =====================================================
    const universitySchema = {
      '@type': 'CollegeOrUniversity',

      '@id': `${baseUrl}/#university`,

      name: 'Amity University Noida',

      alternateName: 'Amity University Uttar Pradesh, Noida Campus',

      url: `${baseUrl}/`,

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
    // WEBSITE
    // =====================================================
    const websiteSchema = {
      '@type': 'WebSite',

      '@id': `${baseUrl}/#website`,

      url: `${baseUrl}/`,

      name: 'Amity University Noida',

      publisher: {
        '@id': `${baseUrl}/#university`,
      },

      inLanguage: 'en-IN',
    };

    // =====================================================
    // WEB PAGE
    // =====================================================
    const webPageSchema = {
      '@type': 'WebPage',

      '@id': `${pageUrl}#webpage`,

      url: pageUrl,

      name: title,

      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },

      mainEntity: {
        '@id': `${pageUrl}#article`,
      },

      breadcrumb: {
        '@id': `${pageUrl}#breadcrumb`,
      },

      inLanguage: 'en-IN',
    };

    // =====================================================
    // NEWS ARTICLE
    // =====================================================
    const newsArticleSchema: any = {
      '@type': 'NewsArticle',

      '@id': `${pageUrl}#article`,

      url: pageUrl,

      headline: title,

      articleSection: articleSection,

      publisher: {
        '@id': `${baseUrl}/#university`,
      },

      mainEntityOfPage: {
        '@id': `${pageUrl}#webpage`,
      },

      inLanguage: 'en-IN',
    };

    // Only add description when available
    if (description) {
      newsArticleSchema.description = description;
    }

    // Only add dates when valid
    if (publishedDate) {
      newsArticleSchema.datePublished = publishedDate;
    }

    if (modifiedDate) {
      newsArticleSchema.dateModified = modifiedDate;
    }

    // Only add image when actual article image exists
    if (imageUrl) {
      newsArticleSchema.image = imageUrl;
    }

    // =====================================================
    // CONTRIBUTORS
    //
    // IMPORTANT:
    // Replace these property names with your actual API
    // fields if they are different.
    // =====================================================
    const contributors: any[] = [];

    if (blog?.ContributorName1) {
      const contributorId1 = this.createSchemaSlug(blog.ContributorName1);

      contributors.push({
        '@type': 'Person',

        '@id': `${pageUrl}#${contributorId1}`,

        name: blog.ContributorName1,

        ...(blog?.ContributorDesignation1 && {
          jobTitle: blog.ContributorDesignation1,
        }),

        affiliation: {
          '@id': `${baseUrl}/#university`,
        },
      });
    }

    if (blog?.ContributorName2) {
      const contributorId2 = this.createSchemaSlug(blog.ContributorName2);

      contributors.push({
        '@type': 'Person',

        '@id': `${pageUrl}#${contributorId2}`,

        name: blog.ContributorName2,

        ...(blog?.ContributorDesignation2 && {
          jobTitle: blog.ContributorDesignation2,
        }),

        affiliation: {
          '@id': `${baseUrl}/#university`,
        },
      });
    }

    // Reference contributors from NewsArticle
    if (contributors.length) {
      newsArticleSchema.contributor = contributors.map((person: any) => ({
        '@id': person['@id'],
      }));
    }

    // =====================================================
    // SOURCE PUBLICATION / CREATIVE WORK
    // =====================================================
    let sourcePublicationSchema: any = null;

    const sourcePublication =
      blog?.SourcePublication || blog?.PublicationName || blog?.SourceName;

    if (sourcePublication) {
      sourcePublicationSchema = {
        '@type': 'CreativeWork',

        '@id': `${pageUrl}#source-publication`,

        name: sourcePublication,
      };

      if (publishedDate) {
        sourcePublicationSchema.datePublished = publishedDate;
      }

      newsArticleSchema.isBasedOn = {
        '@id': `${pageUrl}#source-publication`,
      };
    }

    // =====================================================
    // BREADCRUMB
    // =====================================================
    const breadcrumbSchema = {
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

          name: 'News',

          item: `${baseUrl}/news`,
        },

        {
          '@type': 'ListItem',

          position: 3,

          name: title,

          item: pageUrl,
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
      newsArticleSchema,
    ];

    // Add Person schemas
    contributors.forEach((person) => {
      graph.push(person);
    });

    // Add source publication only when available
    if (sourcePublicationSchema) {
      graph.push(sourcePublicationSchema);
    }

    graph.push(breadcrumbSchema);

    // =====================================================
    // FINAL JSON-LD
    // =====================================================
    const schema = {
      '@context': 'https://schema.org',

      '@graph': graph,
    };

    // =====================================================
    // REMOVE EXISTING JSON-LD
    // =====================================================
    const existingScript = document.getElementById('structured-data');

    if (existingScript) {
      existingScript.remove();
    }

    // =====================================================
    // INSERT JSON-LD
    // =====================================================
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

  private createSchemaSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/dr\.?/gi, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
