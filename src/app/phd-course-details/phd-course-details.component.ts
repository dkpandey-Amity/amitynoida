import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CleanHtmlPipe } from '../custompipe/clean-html.pipe';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HostListener } from '@angular/core';
import { CleanHtmlPtagPipe } from '../service/clean-htmlptag.pipe';
import {
  LandingserviceService,
  OtpResponse,
} from '../service/landingservice.service';

@Component({
  selector: 'app-phd-course-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CleanHtmlPipe,
    FormsModule,
    ReactiveFormsModule,
    CleanHtmlPtagPipe,
  ],
  templateUrl: './phd-course-details.component.html',
  styleUrl: './phd-course-details.component.css',
})
export class PhdCourseDetailsComponent implements OnInit {
  sDiscipline!: string;
  iDisciplineId!: number;
  sCourseCode!: string;
  getPhdProgramData: any[] = [];

  pageMeta: any;

  brochureForm!: FormGroup;
  selectedBrochure: any;
  showBrochurePopup = false;

  showImageModal = false;
  selectedImage = '';
  selectedImageLink = '';

  showQuickLinks = false;
  quickLinksClosed = false;

  countryCodes: string[] = [];

  otpSent = false;
  otpVerified = false;
  otpMessage = '';
  otpStatus: 'success' | 'error' | '' = '';

  loginNo = '';
  formNo = '';

  isSubmitting = false;
  otpTimer = 0;
  otpInterval: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private meta: Meta,
    private router: Router,
    private titleService: Title,
    private fb: FormBuilder,
    private landingService: LandingserviceService,
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Don't show again if user closed it
    if (this.quickLinksClosed) {
      return;
    }

    // Show after scroll
    if (window.scrollY > 50) {
      this.showQuickLinks = true;
    } else {
      // Hide on top
      this.showQuickLinks = false;
    }
  }

  closeQuickLinks(): void {
    this.quickLinksClosed = true;
    localStorage.setItem('quickLinksClosed', 'true');
  }

  ngOnInit(): void {
    this.loadCountryCodes();

    this.route.params.subscribe((params) => {
      const disciplineSlug = params['Disciplineslugname'];
      const categorySlug = params['SlugName'];

      if (disciplineSlug && categorySlug) {
        this.getAllProgramMetas(categorySlug);
        this.loadPhdProgram(disciplineSlug, categorySlug);
      } else {
        console.warn('Required params missing in URL');
      }
    });

    this.brochureForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      otp: [''],
    });

    // Change validation according to country
    this.brochureForm.get('countryCode')?.valueChanges.subscribe((code) => {
      const phoneCtrl = this.brochureForm.get('phone');

      if (code === '+91') {
        // India
        phoneCtrl?.setValidators([
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/),
        ]);
      } else {
        // International
        phoneCtrl?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6,15}$/),
        ]);
      }

      phoneCtrl?.updateValueAndValidity();
    });

    this.quickLinksClosed = localStorage.getItem('quickLinksClosed') === 'true';
  }

  
  ngOnDestroy(): void {
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
    }
  }

  loadCountryCodes(): void {
    this.landingService.getCountryCodes().subscribe({
      next: (res) => {
        if (res.success) {
          this.countryCodes = res.data.map((x) => x.CountryCode);
        }
      },
    });
  }

  get isIndian(): boolean {
    return this.brochureForm?.get('countryCode')?.value === '+91';
  }

  sendOtp(): void {
    const formData = this.brochureForm.getRawValue();

    const code = formData.countryCode;
    const target: 'mobile' | 'email' = code === '+91' ? 'mobile' : 'email';

    // Name is mandatory
    if (this.brochureForm.get('name')?.invalid) {
      this.brochureForm.get('name')?.markAsTouched();
      return;
    }

    // Validate according to target
    if (target === 'mobile') {
      if (this.brochureForm.get('phone')?.invalid) {
        this.brochureForm.get('phone')?.markAsTouched();
        return;
      }
    } else {
      if (this.brochureForm.get('email')?.invalid) {
        this.brochureForm.get('email')?.markAsTouched();
        return;
      }
    }

    this.isSubmitting = true;
    this.otpMessage = '';
    this.otpStatus = '';

    this.landingService
      .sendOtp({
        firstName: formData.name,
        email: formData.email,
        countryCode: formData.countryCode,
        mobile: formData.phone,
        target,
      })
      .subscribe({
        next: (res: OtpResponse) => {
          this.isSubmitting = false;

          if (res.success) {
            this.loginNo = res.loginNo || '';
            this.otpSent = true;

            this.otpStatus = 'success';
            this.otpMessage =
              target === 'mobile'
                ? 'OTP sent to your mobile.'
                : 'OTP sent to your email.';

            // Disable input
            if (target === 'mobile') {
              this.brochureForm.get('phone')?.disable();
            } else {
              this.brochureForm.get('email')?.disable();
            }

            // Start 30 sec timer
            this.startOtpTimer();
          } else {
            this.otpStatus = 'error';
            this.otpMessage = res.message || 'Failed to send OTP.';
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.otpStatus = 'error';
          this.otpMessage = 'Failed to send OTP.';
        },
      });
  }

  startOtpTimer(): void {
    this.otpTimer = 30;

    if (this.otpInterval) {
      clearInterval(this.otpInterval);
    }

    this.otpInterval = setInterval(() => {
      this.otpTimer--;

      if (this.otpTimer <= 0) {
        clearInterval(this.otpInterval);
      }
    }, 1000);
  }

  resendOtp(): void {
    if (this.otpTimer > 0) {
      return;
    }

    this.brochureForm.get('phone')?.enable();
    this.brochureForm.get('email')?.enable();

    this.sendOtp();
  }

  verifyOtp() {
    if (this.isSubmitting || this.otpVerified) {
      return;
    }

    const otp = this.brochureForm.get('otp')?.value?.toString().trim();

    if (!otp || !/^\d{4}$/.test(otp)) {
      return;
    }

    this.isSubmitting = true;
    this.otpMessage = 'Verifying OTP...';
    this.otpStatus = '';

    this.landingService.verifyOtp(this.loginNo, otp).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.success) {
          this.otpVerified = true;
          this.formNo = res.formNo || '';

          this.otpStatus = 'success';
          this.otpMessage = '✅ OTP Verified Successfully';

          this.brochureForm.get('otp')?.disable();

          // Optional: disable other fields too
          this.brochureForm.get('phone')?.disable();
          this.brochureForm.get('email')?.disable();
          this.brochureForm.get('countryCode')?.disable();
        } else {
          this.otpStatus = 'error';
          this.otpMessage = res.message || 'Invalid OTP';
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.otpStatus = 'error';
        this.otpMessage = 'OTP verification failed.';
      },
    });
  }

  onOtpInput(): void {
    const otp = this.brochureForm.get('otp')?.value?.toString().trim();

    // Wait until user enters exactly 4 digits
    if (!/^\d{4}$/.test(otp)) {
      return;
    }

    // Prevent multiple API calls
    if (this.otpVerified || this.isSubmitting) {
      return;
    }

    this.verifyOtp();
  }

  openImageModal(image: string, link: string) {
    this.selectedImage = image;
    this.selectedImageLink = link;
    this.showImageModal = true;
  }

  openBrochurePopup(item: any) {
    this.selectedBrochure = item;
    this.showBrochurePopup = true;
  }

  submitBrochureForm() {
    if (this.brochureForm.invalid) {
      this.brochureForm.markAllAsTouched();
      return;
    }

    if (!this.otpVerified) {
      alert('Please verify OTP first.');
      return;
    }

    const formData = this.brochureForm.getRawValue();

    const payload = {
      Name: formData.name,
      Email: formData.email,
      Phone: formData.phone, // Only mobile number
      Message: 'Brochure',
      scoursecode: this.selectedBrochure?.sCourseCode,
      stype: 'phd',
      scountrycode: formData.countryCode, // +91 or other country code
      spageurl: window.location.href,
    };

    console.log(payload);

    this.apiService.allCourseSubmitEnquiryForm(payload).subscribe({
      next: () => {
        this.showBrochurePopup = false;

        const brochureUrl = `https://img.amizone.net/AzureFileHandler.ashx?FileName=amitywebsite/amitynoida/${this.selectedBrochure.CourseBroucher}`;

        window.open(brochureUrl, '_blank');

        this.brochureForm.reset({
          countryCode: '+91',
        });

        // Reset OTP state
        this.otpVerified = false;
        this.otpSent = false;
        this.otpStatus = '';
        this.otpMessage = '';
        this.loginNo = '';
        this.formNo = '';

        // Re-enable controls if they were disabled after OTP verification
        this.brochureForm.get('email')?.enable();
        this.brochureForm.get('phone')?.enable();
        this.brochureForm.get('countryCode')?.enable();
        this.brochureForm.get('otp')?.enable();
      },
      error: (err) => {
        console.log('Status:', err.status);
      },
    });
  }

  loadPhdProgram(disciplineSlug: string, categorySlug: string): void {
    this.apiService
      .GetPhdCourseDetails(disciplineSlug, categorySlug)
      .subscribe({
        next: (data: any[]) => {
          if (!data?.length) return;

          // ✅ FIND CORRECT PROGRAM (IMPORTANT FIX)
          const program = data.find(
            (x: any) =>
              x.SlugName?.toLowerCase() === categorySlug.toLowerCase() ||
              x.OldUrl?.toLowerCase() === categorySlug.toLowerCase(),
          );

          if (!program) {
            console.warn('Program not found');
            return;
          }

          const newUrl = program.NewUrl?.toLowerCase();
          const oldUrl = program.OldUrl?.toLowerCase();
          const current = categorySlug?.toLowerCase();

          // ✅ ONLY OLD → NEW
          if (oldUrl && newUrl && current === oldUrl) {
            this.router.navigate(['/phd', disciplineSlug, newUrl], {
              replaceUrl: true,
            });
            return;
          }

          // ✅ SET ONLY MATCHED PROGRAM
          this.getPhdProgramData = [program];

          // ✅ META + SCHEMA after data
          this.getAllProgramMetas(categorySlug);

          if (this.pageMeta) {
            this.injectStructuredData(this.pageMeta);
          }
        },
        error: (err) => {
          console.error(err);
          this.router.navigate(['/404']);
        },
      });
  }

  // ngOnInit(): void {
  //   this.getAllUgProgramMetas();

  //   const disciplineSlug = this.route.snapshot.paramMap.get('Disciplineslugname');
  //   const categorySlug = this.route.snapshot.paramMap.get('SlugName');

  //   if (disciplineSlug && categorySlug) {
  //     this.fetchPhdProgramDetails(disciplineSlug, categorySlug);
  //   } else {
  //     console.warn('Required params missing in URL');
  //   }
  // }

  // private fetchPhdProgramDetails(
  //   disciplineSlug: string,
  //   categorySlug: string,
  // ): void {
  //   this.apiService
  //     .GetPhdCourseDetails(disciplineSlug, categorySlug)
  //     .subscribe({
  //       next: (data: any[]) => {
  //         this.getPhdProgramData = data;

  //         if (this.pageMeta) {
  //           this.injectStructuredData(this.pageMeta);
  //         }
  //       },
  //     });
  // }

  // private fetchPhdProgramDetails(): void {
  //   this.apiService.GetPhdCourseDetails(this.sCourseCode).subscribe({
  //     next: (data: any[]) => {
  //       this.getPhdProgramData = data;

  //       // ✅ NOW SAFE
  //       if (this.pageMeta) {
  //         this.injectStructuredData(this.pageMeta);
  //       }
  //     },
  //   });
  // }

  getAllProgramMetas(slug: string) {
    this.apiService.getAllProgramMetas(slug).subscribe({
      next: (data: any[]) => {
        const pageData = data?.[0];

        if (pageData) {
          this.pageMeta = pageData;

          this.titleService.setTitle(pageData.Title);
          this.meta.updateTag({
            name: 'description',
            content: pageData.Description,
          });
          this.meta.updateTag({
            name: 'keywords',
            content: pageData.Keywords,
          });

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const pageUrl = window.location.href;

          const program =
            this.getPhdProgramData && this.getPhdProgramData.length > 0
              ? this.getPhdProgramData[0]
              : null;

          const title =
            pageData?.Title || program?.ProgramName || 'PhD Programme';

          const description =
            pageData?.Description ||
            program?.Description ||
            'Explore PhD programme at Amity University Noida.';

          const imageUrl = pageData?.ImageUrl
            ? `https://noida.amity.edu/${pageData.ImageUrl}`
            : 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

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

          this.setCanonicalLink(window.location.href);
        }
      },
    });
  }
  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';

    // Get slugs from route parameters - with fallbacks
    let disciplineSlug = this.route.snapshot.paramMap.get('discipline');
    const programSlug = this.route.snapshot.paramMap.get('SlugName');

    // FALLBACK: If disciplineSlug is null, try to get it from pageData
    if (!disciplineSlug && pageData && pageData.Disciplineslugname) {
      disciplineSlug = pageData.Disciplineslugname;
    }

    // FALLBACK 2: If still null, use a default or construct from pageData.sDiscipline
    if (!disciplineSlug && pageData && pageData.sDiscipline) {
      disciplineSlug = pageData.sDiscipline.toLowerCase().replace(/\s+/g, '-');
    }

    // Construct the canonical URL - ONLY if we have a disciplineSlug
    const canonicalUrl = disciplineSlug
      ? `${baseUrl}/phd/${disciplineSlug}/${programSlug}`
      : `${baseUrl}/phd/${programSlug}`; // Fallback without discipline

    // Get program data for FAQ
    const program =
      this.getPhdProgramData && this.getPhdProgramData.length > 0
        ? this.getPhdProgramData[0]
        : null;

    let faqItems: any[] = [];

    if (program) {
      const faqPairs = [
        { q: program.FaqQuestion, a: program.FaqAnswer },
        { q: program.FaqQuestion2, a: program.FaqAnswer2 },
        { q: program.FaqQuestion3, a: program.FaqAnswer3 },
        { q: program.FaqQuestion4, a: program.FaqAnswer4 },
        { q: program.FaqQuestion5, a: program.FaqAnswer5 },
      ];

      faqPairs.forEach((pair) => {
        if (pair.q && pair.a) {
          faqItems.push({
            '@type': 'Question',
            name: pair.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: pair.a,
            },
          });
        }
      });
    }

    const faqSchema =
      faqItems.length > 0
        ? {
            '@type': 'FAQPage',
            '@id': `${canonicalUrl}#faq`,
            mainEntity: faqItems,
          }
        : null;

    /* ================= MAIN GRAPH ================= */
    const graph: any[] = [
      /* ===== WEBPAGE ===== */
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageData?.Title || program?.Title || 'PhD Program',
        description: pageData?.Description || program?.Description || '',
        inLanguage: 'en',
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        about: {
          '@id': `${canonicalUrl}#phd-program`,
        },
        breadcrumb: {
          '@id': `${canonicalUrl}#breadcrumb`,
        },
      },

      /* ===== EDUCATIONAL PROGRAM ===== */
      {
        '@type': 'EducationalOccupationalProgram',
        '@id': `${canonicalUrl}#phd-program`,
        name: pageData?.Title || program?.ProgramName || 'PhD Program',
        description: pageData?.Description || program?.Description || '',
        educationalLevel: 'Doctoral',
        programType: 'PhD Programme',
        educationalCredentialAwarded: 'PhD',
        provider: {
          '@id': `${baseUrl}/#university`,
        },
        ...(pageData?.ProgramMode && {
          educationalProgramMode: pageData.ProgramMode,
        }),
        ...(pageData?.OccupationalCategory && {
          occupationalCategory: pageData.OccupationalCategory,
        }),
        ...(pageData?.TimeToComplete && {
          timeToComplete: pageData.TimeToComplete,
        }),
        ...(pageData?.ProgramPrerequisites && {
          programPrerequisites: pageData.ProgramPrerequisites,
        }),
      },

      /* ===== UNIVERSITY ===== */
      {
        '@type': 'CollegeOrUniversity',
        '@id': `${baseUrl}/#university`,
        name: 'Amity University Noida',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/assets/images/amity-logo.png`,
        },
      },

      /* ===== BREADCRUMB LIST ===== */
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
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
            name: 'PhD Programmes',
            item: `${baseUrl}/phd`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: pageData?.sDiscipline || disciplineSlug || 'PhD',
            item: disciplineSlug
              ? `${baseUrl}/phd/${disciplineSlug}`
              : `${baseUrl}/phd`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: pageData?.Title || program?.ProgramName || 'Program Details',
            item: canonicalUrl,
          },
        ],
      },

      /* ===== WEBSITE ===== */
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Amity University Noida',
        publisher: {
          '@id': `${baseUrl}/#university`,
        },
      },
    ];

    /* ===== ADD FAQ IF EXISTS ===== */
    if (faqSchema) {
      graph.push(faqSchema);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@graph': graph,
    };

    // Remove existing structured data script if present
    const existing = document.getElementById('structured-data');
    if (existing) existing.remove();

    // Add new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema, null, 2); // Pretty print for debugging
    document.head.appendChild(script);

    // Debug log to verify
    console.log('Structured Data Generated:', schema);
  }

  // injectStructuredData(pageData: any): void {
  //   const baseUrl = 'https://noida.amity.edu';
  //   const canonicalUrl = pageData.CanonicalUrl || window.location.href;

  //   const schema = {
  //     '@context': 'https://schema.org',
  //     '@graph': [
  //       /* ================= WEBPAGE ================= */
  //       {
  //         '@type': 'WebPage',
  //         '@id': `${canonicalUrl}#webpage`,
  //         url: canonicalUrl,
  //         name: pageData.Title,
  //         description: pageData.Description,
  //         inLanguage: 'en',
  //         isPartOf: { '@id': `${baseUrl}/#website` },
  //         about: { '@id': `${canonicalUrl}#phd-program` },
  //         breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
  //       },

  //       /* ================= PHD PROGRAM ================= */
  //       {
  //         '@type': 'EducationalOccupationalProgram',
  //         '@id': `${canonicalUrl}#phd-program`,
  //         name: pageData.Title,
  //         description: pageData.Description,
  //         educationalLevel: 'Doctoral',
  //         programType: 'PhD Programme',
  //         educationalCredentialAwarded: 'PhD',
  //         provider: { '@id': `${baseUrl}/#university` },

  //         ...(pageData.ProgramMode && {
  //           educationalProgramMode: pageData.ProgramMode,
  //         }),
  //         ...(pageData.OccupationalCategory && {
  //           occupationalCategory: pageData.OccupationalCategory,
  //         }),
  //         ...(pageData.TimeToComplete && {
  //           timeToComplete: pageData.TimeToComplete,
  //         }),
  //         ...(pageData.ProgramPrerequisites && {
  //           programPrerequisites: pageData.ProgramPrerequisites,
  //         }),
  //       },

  //       /* ================= UNIVERSITY ================= */
  //       {
  //         '@type': 'CollegeOrUniversity',
  //         '@id': `${baseUrl}/#university`,
  //         name: 'Amity University Noida',
  //         url: baseUrl,
  //         logo: {
  //           '@type': 'ImageObject',
  //           url: `${baseUrl}/assets/images/amity-logo.png`,
  //         },
  //       },

  //       /* ================= BREADCRUMB ================= */
  //       {
  //         '@type': 'BreadcrumbList',
  //         '@id': `${canonicalUrl}#breadcrumb`,
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
  //             name: 'PhD Programmes',
  //             item: `${baseUrl}/phd`,
  //           },
  //           {
  //             '@type': 'ListItem',
  //             position: 3,
  //             name: pageData.sDiscipline,
  //             item: `${baseUrl}/phd/${pageData.Disciplineslugname}`,
  //           },
  //           {
  //             '@type': 'ListItem',
  //             position: 4,
  //             name: pageData.Title,
  //             item: canonicalUrl,
  //           },
  //         ],
  //       },

  //       /* ================= WEBSITE ================= */
  //       {
  //         '@type': 'WebSite',
  //         '@id': `${baseUrl}/#website`,
  //         url: baseUrl,
  //         name: 'Amity University Noida',
  //         publisher: { '@id': `${baseUrl}/#university` },
  //       },
  //     ],
  //   };

  //   const existing = document.getElementById('structured-data');
  //   if (existing) existing.remove();

  //   const script = document.createElement('script');
  //   script.type = 'application/ld+json';
  //   script.id = 'structured-data';
  //   script.text = JSON.stringify(schema);
  //   document.head.appendChild(script);
  // }

  private setCanonicalLink(url: string) {
    const link: HTMLLinkElement =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);

    if (!link.parentNode) {
      document.head.appendChild(link);
    }
  }

  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim()
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
