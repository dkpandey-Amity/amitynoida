import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CommonModule } from '@angular/common';
import { CleanHtmlPipe } from '../custompipe/clean-html.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faculty-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CleanHtmlPipe],
  templateUrl: './faculty-details.component.html',
  styleUrl: './faculty-details.component.css',
})
export class FacultyDetailsComponent implements OnInit {
  facultyData: any;
  FacultySlug: any;
  FacultyID!: number;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.FacultySlug = this.route.snapshot.paramMap.get('FacultySlug');

    this.apiService
      .getFacultyDetails(this.FacultySlug)
      .subscribe((data: any) => {
        // this.facultyData = Array.isArray(data) ? data[0] : data;
        this.facultyData = data[0];

        this.updateMetaTags();
      });
  }

  updateMetaTags(): void {
    const metaTitle =
      this.facultyData?.MetaTitle ||
      this.facultyData?.Name ||
      'Faculty | Amity University Noida';

    const metaDescription =
      this.facultyData?.MetaDescription ||
      this.facultyData?.Name ||
      'Faculty | Amity University Noida';

    const metaKeyword =
      this.facultyData?.MetaKeyword ||
      this.facultyData?.Name ||
      'Faculty | Amity University Noida';

    this.titleService.setTitle(metaTitle);

    this.meta.updateTag({
      name: 'description',
      content: metaDescription,
    });

    this.meta.updateTag({
      name: 'keywords',
      content: metaKeyword,
    });

    // ================= Open Graph Meta Tags =================
    this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

    this.meta.updateTag({ property: 'og:type', content: 'profile' });

    this.meta.updateTag({
      property: 'og:title',
      content: metaTitle,
    });

    this.meta.updateTag({
      property: 'og:description',
      content: metaDescription,
    });

    this.meta.updateTag({
      property: 'og:url',
      content: window.location.href,
    });

    this.meta.updateTag({
      property: 'og:site_name',
      content: 'Amity University Noida',
    });

    const imageUrl = this.facultyData?.ImagePath
      ? `https://img.amizone.net/AzureFileHandler.ashx?FileName=amitywebsite/userfiles/Noida2024/${this.facultyData.ImagePath}`
      : 'https://noida.amity.edu/assets/images/default-faculty.png';

    this.meta.updateTag({
      property: 'og:image',
      content: imageUrl,
    });

    this.meta.updateTag({
      property: 'og:image:alt',
      content: metaTitle,
    });

    // ================= Twitter (X) Meta Tags =================
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: metaTitle,
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: metaDescription,
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: imageUrl,
    });

    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: metaTitle,
    });

    this.meta.updateTag({
      name: 'twitter:site',
      content: '@AmityUni',
    });

    this.meta.updateTag({
      name: 'twitter:creator',
      content: '@AmityUni',
    });

    const canonicalUrl = `https://noida.amity.edu/faculty/${this.FacultySlug}`;

    this.setCanonicalLink(canonicalUrl);

    this.injectStructuredData();
  }

  private stripHtml(value: string): string {
    if (!value) {
      return '';
    }

    const temp = document.createElement('div');

    temp.innerHTML = value;

    return temp.textContent?.trim() || '';
  }

  injectStructuredData(): void {
    if (!this.facultyData) {
      return;
    }

    const baseUrl = 'https://noida.amity.edu';
    const homeUrl = `${baseUrl}/`;

    const pageUrl = `${baseUrl}/faculty/${this.FacultySlug}`;

    // =====================================================
    // FACULTY BASIC DATA
    // =====================================================

    const facultyName = this.facultyData?.Name || 'Faculty Member';

    const designation = this.facultyData?.Designation || '';

    const description = this.stripHtml(
      this.facultyData?.Description ||
        this.facultyData?.ProfileDescription ||
        this.facultyData?.About ||
        this.facultyData?.MetaDescription ||
        '',
    );

    const imageUrl = this.facultyData?.ImagePath
      ? `https://img.amizone.net/AzureFileHandler.ashx?FileName=amitywebsite/userfiles/Noida2024/${this.facultyData.ImagePath}`
      : 'https://noida.amity.edu/assets/images/default-faculty.png';

    // =====================================================
    // SCHOOL / INSTITUTE
    // Map according to your API
    // =====================================================

    const schoolName =
      this.facultyData?.InstituteName ||
      this.facultyData?.SchoolName ||
      this.facultyData?.DepartmentName ||
      '';

    // =====================================================
    // AFFILIATED UNIVERSITY
    //
    // IMPORTANT:
    // For Noida faculty this should normally be
    // Amity University Noida.
    //
    // If your API provides Haryana / another campus,
    // use that value dynamically.
    // =====================================================

    const affiliatedUniversity =
      this.facultyData?.UniversityName || 'Amity University Noida';

    // =====================================================
    // RESEARCH INTEREST / KNOWS ABOUT
    // =====================================================

    const researchText =
      this.facultyData?.ResearchInterest ||
      this.facultyData?.ResearchInterests ||
      this.facultyData?.AreaOfInterest ||
      this.facultyData?.Specialization ||
      '';

    const knowsAbout: string[] = researchText
      ? researchText
          .split(/[,;|]/)
          .map((item: string) => this.stripHtml(item).trim())
          .filter((item: string) => item.length > 0)
      : [];

    // =====================================================
    // UNIVERSITY
    // Main university used by website
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
    // WEBSITE
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
    // PROFILE PAGE
    // =====================================================

    const profilePageSchema = {
      '@type': 'ProfilePage',

      '@id': `${pageUrl}#webpage`,

      url: pageUrl,

      name: facultyName,

      isPartOf: {
        '@id': `${homeUrl}#website`,
      },

      mainEntity: {
        '@id': `${pageUrl}#person`,
      },

      breadcrumb: {
        '@id': `${pageUrl}#breadcrumb`,
      },

      inLanguage: 'en-IN',
    };

    // =====================================================
    // PERSON
    // =====================================================

    const personSchema: any = {
      '@type': 'Person',

      '@id': `${pageUrl}#person`,

      name: facultyName,

      url: pageUrl,

      image: imageUrl,

      mainEntityOfPage: {
        '@id': `${pageUrl}#webpage`,
      },
    };

    // Add designation only when available
    if (designation) {
      personSchema.jobTitle = designation;
    }

    // Add description only when available
    if (description) {
      personSchema.description = description;
    }

    // =====================================================
    // SCHOOL RELATION
    // =====================================================

    if (schoolName) {
      personSchema.worksFor = {
        '@id': `${pageUrl}#school`,
      };
    }

    // =====================================================
    // AFFILIATION
    // =====================================================

    if (
      affiliatedUniversity &&
      affiliatedUniversity.toLowerCase() !== 'amity university noida'
    ) {
      personSchema.affiliation = {
        '@id': `${pageUrl}#affiliated-university`,
      };
    } else {
      personSchema.affiliation = {
        '@id': `${homeUrl}#university`,
      };
    }

    // =====================================================
    // KNOWS ABOUT
    // =====================================================

    if (knowsAbout.length) {
      personSchema.knowsAbout = knowsAbout;
    }

    // =====================================================
    // SAME AS / EXTERNAL PROFILE
    // =====================================================

    const externalProfile =
      this.facultyData?.ProfileUrl ||
      this.facultyData?.ExternalProfileUrl ||
      this.facultyData?.OldProfileUrl ||
      '';

    if (externalProfile) {
      personSchema.sameAs = [externalProfile];
    }

    // =====================================================
    // SCHOOL ORGANIZATION
    // =====================================================

    let schoolSchema: any = null;

    if (schoolName) {
      schoolSchema = {
        '@type': 'Organization',

        '@id': `${pageUrl}#school`,

        name: schoolName,

        parentOrganization: {
          '@id':
            affiliatedUniversity.toLowerCase() === 'amity university noida'
              ? `${homeUrl}#university`
              : `${pageUrl}#affiliated-university`,
        },
      };
    }

    // =====================================================
    // DIFFERENT AFFILIATED UNIVERSITY
    // Example: Amity University Haryana
    // =====================================================

    let affiliatedUniversitySchema: any = null;

    if (
      affiliatedUniversity &&
      affiliatedUniversity.toLowerCase() !== 'amity university noida'
    ) {
      affiliatedUniversitySchema = {
        '@type': 'CollegeOrUniversity',

        '@id': `${pageUrl}#affiliated-university`,

        name: affiliatedUniversity,
      };
    }

    // =====================================================
    // CREDENTIALS
    //
    // Map these fields according to your API.
    // =====================================================

    const credentials: any[] = [];

    const qualification1 =
      this.facultyData?.Qualification1 || this.facultyData?.Degree1 || '';

    const qualification2 =
      this.facultyData?.Qualification2 || this.facultyData?.Degree2 || '';

    const qualification3 =
      this.facultyData?.Qualification3 || this.facultyData?.Degree3 || '';

    const university1 =
      this.facultyData?.University1 || this.facultyData?.Institute1 || '';

    const university2 =
      this.facultyData?.University2 || this.facultyData?.Institute2 || '';

    const university3 =
      this.facultyData?.University3 || this.facultyData?.Institute3 || '';

    // =====================================================
    // CREATE CREDENTIAL HELPER
    // =====================================================

    const addCredential = (
      qualification: string,
      institution: string,
      id: string,
    ) => {
      if (!qualification) {
        return;
      }

      const credential: any = {
        '@type': 'EducationalOccupationalCredential',

        '@id': `${pageUrl}#${id}`,

        name: this.stripHtml(qualification),

        credentialCategory: 'degree',
      };

      if (institution) {
        credential.recognizedBy = {
          '@type': 'CollegeOrUniversity',

          name: this.stripHtml(institution),
        };
      }

      credentials.push(credential);
    };

    addCredential(qualification1, university1, 'credential-1');

    addCredential(qualification2, university2, 'credential-2');

    addCredential(qualification3, university3, 'credential-3');

    // =====================================================
    // CONNECT CREDENTIALS TO PERSON
    // =====================================================

    if (credentials.length) {
      personSchema.hasCredential = credentials.map((credential: any) => ({
        '@id': credential['@id'],
      }));
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

          item: homeUrl,
        },

        {
          '@type': 'ListItem',

          position: 2,

          name: 'Faculty',

          item: `${baseUrl}/faculty`,
        },

        {
          '@type': 'ListItem',

          position: 3,

          name: facultyName,

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

      profilePageSchema,

      personSchema,
    ];

    // School
    if (schoolSchema) {
      graph.push(schoolSchema);
    }

    // Different affiliated university
    if (affiliatedUniversitySchema) {
      graph.push(affiliatedUniversitySchema);
    }

    // Credentials
    credentials.forEach((credential) => {
      graph.push(credential);
    });

    // Breadcrumb
    graph.push(breadcrumbSchema);

    // =====================================================
    // FINAL SCHEMA
    // =====================================================

    const schema = {
      '@context': 'https://schema.org',

      '@graph': graph,
    };

    // =====================================================
    // REMOVE EXISTING SCHEMA
    // =====================================================

    const oldScript = document.getElementById('structured-data');

    if (oldScript) {
      oldScript.remove();
    }

    // =====================================================
    // CREATE JSON-LD
    // =====================================================

    const script = document.createElement('script');

    script.id = 'structured-data';

    script.type = 'application/ld+json';

    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  // injectStructuredData(): void {
  //   const baseUrl = 'https://noida.amity.edu';
  //   const pageUrl = `${baseUrl}/faculty/${this.FacultySlug}`;

  //   const imageUrl = this.facultyData.ImagePath
  //     ? `https://img.amizone.net/AzureFileHandler.ashx?FileName=amitywebsite/userfiles/Noida2024/${this.facultyData.ImagePath}`
  //     : 'https://noida.amity.edu/assets/images/default-faculty.png';

  //   const schema = {
  //     '@context': 'https://schema.org',
  //     '@type': 'Person',
  //     '@id': pageUrl,
  //     name: this.facultyData.Name,
  //     jobTitle: this.facultyData.Designation,
  //     image: imageUrl,
  //     affiliation: {
  //       '@type': 'CollegeOrUniversity',
  //       name: 'Amity University Noida',
  //       url: baseUrl,
  //     },
  //     url: pageUrl,
  //   };

  //   const old = document.getElementById('structured-data');
  //   if (old) old.remove();

  //   const script = document.createElement('script');
  //   script.id = 'structured-data';
  //   script.type = 'application/ld+json';
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
