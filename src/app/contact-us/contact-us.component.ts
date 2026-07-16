import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../service/noidaweb.service';
import { Meta, Title } from '@angular/platform-browser';

declare var gtag: any; // Declare gtag for Google Analytics

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  contactForm: FormGroup;

  captchaQuestion: string = '';
  captchaAnswer: number = 0;

  constructor(
    private fb: FormBuilder,
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    // Initialize the form with validation
    this.contactForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      Message: ['', [Validators.required, Validators.minLength(10)]],
      stype: [''],
      scoursecode: [''],
      scountrycode: ['+91'],
      captcha: ['', Validators.required],
    });

    this.generateCaptcha();
  }

  ngOnInit(): void {
    this.updateMetaTags();
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

    const payload = {
      Name: this.contactForm.value.Name,
      Email: this.contactForm.value.Email,
      Phone: this.contactForm.value.Phone,
      Message: this.contactForm.value.Message,
      scoursecode: this.contactForm.value.scoursecode || '',
      stype: this.contactForm.value.stype || '',
      scountrycode: this.contactForm.value.scountrycode || '+91',
      spageurl: window.location.href,
    };

    this.apiService.postEnquiryForm(payload).subscribe({
      next: (response: any) => {
        this.toastr.success('Form submitted successfully!', 'Success');
        this.contactForm.reset();

        // Optional: reset default values
        this.contactForm.patchValue({
          stype: '',
          scoursecode: '',
          scountrycode: '+91',
        });

        this.generateCaptcha();
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Error submitting form', 'Error');
      },
    });
  }

  // onSubmit() {
  //   if (this.contactForm.invalid) {
  //     this.contactForm.markAllAsTouched();
  //     return;
  //   }

  //   if (+this.contactForm.value.captcha !== this.captchaAnswer) {
  //     this.toastr.error('Invalid captcha');
  //     this.generateCaptcha();
  //     this.contactForm.patchValue({ captcha: '' });
  //     return;
  //   }

  //   const formData = this.contactForm.value;

  //   this.apiService.postEnquiryForm(formData).subscribe({
  //     next: (response: any) => {
  //       this.toastr.success('Form submitted successfully!', 'Success');
  //       this.contactForm.reset();
  //       this.generateCaptcha();
  //       this.router.navigate(['/']);
  //     },
  //     error: (error: any) => {
  //       this.toastr.error('Error submitting form', 'Error');
  //     },
  //   });
  // }

  // onSubmit() {

  //   if (this.contactForm.valid) {
  //     const formData = this.contactForm.value;

  //     this.apiService.postEnquiryForm(formData).subscribe({
  //       next: (response: any) => {
  //         console.log('Form Submitted Successfully', response);
  //         this.toastr.success('Form submitted successfully!', 'Success');
  //         alert('Form Submitted Successfully');
  //         this.router.navigate(['/']);
  //       },
  //       error: (error: any) => {
  //         console.log('Error occurred', error);
  //         this.toastr.error('Error submitting form', 'Error');
  //       },
  //     });
  //   } else {
  //     console.log('Form not valid');
  //     this.contactForm.markAllAsTouched();
  //   }
  // }

  // Method to track Apply Now button clicks
  onSendMessageClick(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Contact us Page ( Send Message Button ) ');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Click Send Message',
        placeholder: 'Contact us Page ( Send Message Button ) ',
        value: 1,
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Contact us Page ( Send Message Button ) ',
        eventCategory: 'CTA Click',
        eventAction: 'Click Send Message',
        eventLabel: 'Contact',
      });
    }
  }

  updateMetaTags(): void {
    this.apiService.getcontactusMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
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
            content: metaData.Title || 'Contact Us – Amity University Noida',
          });

          this.meta.updateTag({
            property: 'og:description',
            content:
              metaData.Description ||
              'Get in touch with Amity University Noida for admissions, programs, campus visits, and general inquiries.',
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
            content: 'Contact Amity University Noida',
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: metaData.Title || 'Contact Us – Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:description',
            content:
              metaData.Description ||
              'Get in touch with Amity University Noida for admissions, programs, campus visits, and general inquiries.',
          });

          this.meta.updateTag({
            name: 'twitter:image',
            content: 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg',
          });

          this.meta.updateTag({
            name: 'twitter:image:alt',
            content: 'Contact Amity University Noida',
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          // Set the canonical URL
          this.setCanonicalLink(metaData.CanonicalUrl || window.location.href);

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
    const pageUrl = metaData.CanonicalUrl || `${baseUrl}/contact-us`;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['ContactPage', 'WebPage'],
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: metaData.Title || 'Contact Us – Amity University Noida',
          description:
            metaData.Description ||
            'Official contact page of Amity University Noida — find admissions helplines, student services, international office support, and general contact details.',
          isPartOf: {
            '@id': `${baseUrl}/#website`,
          },
          about: {
            '@id': `${baseUrl}/#university`,
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
          mainEntity: {
            '@id': `${baseUrl}/#university`,
          },
        },

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
              name: 'Contact Us',
              item: pageUrl,
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
          url: `${baseUrl}/`,
          logo: 'https://noida.amity.edu/assets/images/amity-logo.png',
          foundingDate: '2005',
          description:
            'Amity University Noida is a globally recognized private university offering quality education, research-driven programs, and modern infrastructure.',
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
            {
              '@type': 'ContactPoint',
              telephone: '+91-918448396303',
              email: 'international@amity.edu',
              contactType: 'international office',
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
    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]',
    );

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
