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

    this.setCanonicalLink(window.location.href);

    this.injectStructuredData();
  }
  injectStructuredData(): void {
    const baseUrl = 'https://noida.amity.edu';
    const pageUrl = `${baseUrl}/faculty/${this.FacultySlug}`;

    const imageUrl = this.facultyData.ImagePath
      ? `https://img.amizone.net/AzureFileHandler.ashx?FileName=amitywebsite/userfiles/Noida2024/${this.facultyData.ImagePath}`
      : 'https://noida.amity.edu/assets/images/default-faculty.png';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': pageUrl,
      name: this.facultyData.Name,
      jobTitle: this.facultyData.Designation,
      image: imageUrl,
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'Amity University Noida',
        url: baseUrl,
      },
      url: pageUrl,
    };

    const old = document.getElementById('structured-data');
    if (old) old.remove();

    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
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
