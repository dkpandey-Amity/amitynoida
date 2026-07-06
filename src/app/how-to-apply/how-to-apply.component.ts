import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../service/noidaweb.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-how-to-apply',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './how-to-apply.component.html',
  styleUrl: './how-to-apply.component.css',
})
export class HowToApplyComponent {
  contactForm: FormGroup;

  captchaQuestion: string = '';
  captchaAnswer: number = 0;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) {
    // Initialize the form with validation
    this.contactForm = this.fb.group({
      Mob: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Email: ['', [Validators.required, Validators.email]],
      Prob_details: ['', Validators.required],
      captcha: ['', Validators.required],
    });

    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    this.captchaAnswer = num1 + num2;
    this.captchaQuestion = `${num1} + ${num2} = ?`;
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (+this.contactForm.value.captcha !== this.captchaAnswer) {
      this.toastr.error('Invalid captcha');
      this.generateCaptcha();
      this.contactForm.patchValue({ captcha: '' });
      return;
    }

    const formData = this.contactForm.value;

    this.apiService.submitTechnicalProblemform(formData).subscribe({
      next: (response) => {
        console.log('Form submitted successfully', response);
        this.toastr.success('Form submitted successfully!', 'Success');
        this.router.navigate(['/']); // Navigate to home or another page after success
      },
      error: (error) => {
        console.error('Error submitting the form', error);
        this.toastr.error(
          'Error submitting the form. Please try again.',
          'Error',
        );
      },
    });
  }

  ngOnInit(): void {
    this.updateMetaTags();
  }

  updateMetaTags(): void {
    this.apiService.getHowToApplyMeta().subscribe({
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

          // ================= Open Graph Meta Tags =================
          this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

          this.meta.updateTag({ property: 'og:type', content: 'website' });

          this.meta.updateTag({
            property: 'og:title',
            content: metaData.Title || 'How to Apply – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Step-by-step guide for applying to undergraduate, postgraduate, doctoral, and international programs at Amity University Noida.',
          });

          this.meta.updateTag({
            property: 'og:url',
            content: metaData.CanonicalUrl || window.location.href,
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
            content: 'How to Apply – Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'How to Apply – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Step-by-step guide for applying to undergraduate, postgraduate, doctoral, and international programs at Amity University Noida.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'How to Apply – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          // Define and set the canonical URL
          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/how-to-apply`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': pageUrl,
          url: pageUrl,
          name: metaData.Title || 'How to Apply – Amity University Noida',
          description:
            metaData.Description ||
            'Step-by-step guide for applying to undergraduate, postgraduate, doctoral, and international programs at Amity University Noida.',
          isPartOf: { '@id': `${baseUrl}/#website` },
          breadcrumb: { '@id': `${baseUrl}/how-to-apply#breadcrumb` },
          mainEntity: { '@id': `${baseUrl}/how-to-apply#howto` },
        },

        {
          '@type': 'HowTo',
          '@id': `${baseUrl}/how-to-apply#howto`,
          name: 'How to Apply to Amity University Noida',
          description:
            'A step-by-step process for completing the Amity University Noida admissions application.',
          totalTime: 'P1D',
          supply: [
            { '@type': 'HowToSupply', name: 'Academic documents' },
            { '@type': 'HowToSupply', name: 'ID proof' },
            { '@type': 'HowToSupply', name: 'Passport-size photograph' },
          ],
          tool: [
            { '@type': 'HowToTool', name: 'Laptop or smartphone' },
            { '@type': 'HowToTool', name: 'Internet connection' },
          ],
          step: [
            {
              '@type': 'HowToStep',
              name: 'Visit the admissions portal',
              url: 'https://portal.amity.edu/',
              text: 'Go to the Amity University online admissions portal.',
            },
            {
              '@type': 'HowToStep',
              name: 'Register a new account',
              text: 'Create your applicant account using your email ID and mobile number.',
            },
            {
              '@type': 'HowToStep',
              name: 'Select your preferred program',
              text: 'Choose the course and discipline you want to apply for.',
            },
            {
              '@type': 'HowToStep',
              name: 'Fill out the application form',
              text: 'Enter your personal, academic, and contact information carefully.',
            },
            {
              '@type': 'HowToStep',
              name: 'Upload required documents',
              text: 'Upload your academic certificates, ID proof, and a passport-size photograph.',
            },
            {
              '@type': 'HowToStep',
              name: 'Pay the application fee',
              text: 'Complete the application by paying the online fee.',
            },
            {
              '@type': 'HowToStep',
              name: 'Submit the application',
              text: 'Review all information and submit your completed application.',
            },
          ],
        },

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

        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'Amity University Noida',
          publisher: { '@id': `${baseUrl}/#university` },
        },

        {
          '@type': 'BreadcrumbList',
          '@id': `${baseUrl}/how-to-apply#breadcrumb`,
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
              name: 'How to Apply',
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
