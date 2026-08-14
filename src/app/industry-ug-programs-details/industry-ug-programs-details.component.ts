import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../service/noidaweb.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CleanHtmlPipe } from '../custompipe/clean-html.pipe';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CleanHtmlPtagPipe } from '../service/clean-htmlptag.pipe';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  LandingserviceService,
  OtpResponse,
} from '../service/landingservice.service';

declare var Moengage: any;

@Component({
  selector: 'app-industry-ug-programs-details',
  standalone: true,
  imports: [
    RouterLink,
    CleanHtmlPipe,
    CommonModule,
    CleanHtmlPtagPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './industry-ug-programs-details.component.html',
  styleUrl: './industry-ug-programs-details.component.css',
})
export class IndustryUgProgramsDetailsComponent implements OnInit {
  getIndustryUgProgramData: any[] = [];
  sDiscipline!: string;
  sCourseCode!: string;
  getUgSemesterDetails: any[] = [];
  programCD!: any;
  programSlug!: string;

  brochureForm!: FormGroup;
  selectedBrochure: any;
  showBrochurePopup = false;

  showImageModal = false;
  selectedImage = '';
  selectedImageLink = '';

  showQuickLinks = false;
  quickLinksClosed = false;

  groupedSemestersArray: Record<
    number,
    {
      type: string;
      remarksGroup: {
        remarks: string;
        minSrNo?: number;
        courses: any[];
      }[];
    }[]
  > = {};

  groupedSemesters: Record<number, Record<string, any[]>> = {};

  isNewProgram = false;
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

    this.sCourseCode = this.route.snapshot.params['SlugName'];
    //this.sCourseCode = history.state.code;
    this.apiService
      .getAllUgIndustryProgramsDetails(this.sCourseCode)
      .subscribe({
        next: (data: any[]) => {
          if (data && data.length > 0) {
            this.getIndustryUgProgramData = data;

            this.getIndustryUgProgramData.forEach((program: any) => {
              this.programCD = program.CourseCD;
              this.getUgProgramDetailsSemester(this.programCD);
            });
            // Load meta + schema only after program data exists
            this.getAllUgProgramMetas();
          } else {
            console.error('No data found for the provided course code.');
          }
        },
        error: (error: any) => {
          console.error('Error fetching UG program details:', error);
        },
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

  private trackMoEngage(eventName: string, eventData: any = {}) {
    if (
      typeof Moengage === 'undefined' ||
      typeof Moengage.track_event !== 'function'
    ) {
      console.warn('MoEngage SDK not available');
      return;
    }

    const raw = this.brochureForm.getRawValue();

    const mobile =
      raw.countryCode.replace(/\D/g, '') + raw.phone.replace(/\D/g, '');

    try {
      Moengage.add_unique_user_id(`${raw.countryCode}-${raw.phone}`);

      Moengage.add_mobile(`+${mobile}`);

      if (raw.name) Moengage.add_first_name(raw.name);

      if (raw.email) Moengage.add_email(raw.email);

      if (this.loginNo) Moengage.add_user_attribute('login_no', this.loginNo);

      if (this.formNo) Moengage.add_user_attribute('form_no', this.formNo);
    } catch (e) {
      console.log(e);
    }

    Moengage.track_event(eventName, {
      ...eventData,
      loginNo: this.loginNo,
      formNo: this.formNo,
      page_url: window.location.href,
    });
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

            this.trackMoEngage('downloadbrouchure_otp_generate_clicked', {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              countryCode: formData.countryCode,
              otpType: target,
              courseCode: this.programCD,
              courseName: this.selectedBrochure?.PrimaryCourseName || '',
              pageUrl: window.location.href,
            });

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
          this.otpSent = false;
          this.otpVerified = true;
          this.formNo = res.formNo || '';

          const formData = this.brochureForm.getRawValue();

          this.trackMoEngage('otp_verified', {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            countryCode: formData.countryCode,
            courseCode: this.programCD,
            courseName: this.selectedBrochure?.PrimaryCourseName || '',
            formNo: res.formNo || '',
            pageUrl: window.location.href,
          });

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
      stype: 'g',
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

  getAllUgProgramMetas() {
    this.sCourseCode = this.route.snapshot.params['SlugName'];
    this.apiService.getAllProgramMetas(this.sCourseCode).subscribe({
      next: (data: any[]) => {
        const pageData = data && data.length > 0 ? data[0] : null;
        if (pageData) {
          // Set the page title with a fallback
          this.titleService.setTitle(pageData.Title || 'Default Title');

          // Update meta tags with fallbacks
          this.meta.updateTag({
            name: 'description',
            content: pageData.Description || 'Default description',
          });
          this.meta.updateTag({
            name: 'keywords',
            content: pageData.Keywords || 'default, keywords',
          });

          // Prepare dynamic values
          const pageUrl = pageData.CanonicalUrl || window.location.href;

          const programName =
            pageData.ProgramName ||
            pageData.Title ||
            'Industry Integrated UG Program';

          const description =
            pageData.Description ||
            'A specialised undergraduate program combining academic learning with real-world industry exposure.';

          // Optional dynamic image (if later available)
          const imageUrl = pageData.ImageUrl
            ? `https://noida.amity.edu/${pageData.ImageUrl}`
            : 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          // ================= Open Graph Meta Tags =================
          this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

          this.meta.updateTag({ property: 'og:type', content: 'website' });

          this.meta.updateTag({
            property: 'og:title',
            content: programName,
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
            content: programName,
          });

          // ================= Twitter (X) Meta Tags =================
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });

          this.meta.updateTag({
            name: 'twitter:title',
            content: programName,
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
            content: programName,
          });

          this.meta.updateTag({
            name: 'twitter:site',
            content: '@AmityUni',
          });

          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          // Set canonical link with a fallback
          // Set canonical link
          this.setCanonicalLink(pageData.canonicalUrl || window.location.href);
          // Call function to inject structured schema
          this.injectStructuredData(pageData);
        } else {
          console.warn('No page data found');
        }
      },
    });
  }

  private stripHtml(html: string): string {
    if (!html) {
      return '';
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    return tempDiv.textContent?.trim() || '';
  }

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';

    const program =
      this.getIndustryUgProgramData?.length > 0
        ? this.getIndustryUgProgramData[0]
        : null;

    if (!program) {
      return;
    }

    // =====================================================
    // PAGE URL
    // =====================================================
    const pageUrl =
      pageData?.CanonicalUrl ||
      pageData?.canonicalUrl ||
      `${baseUrl}${this.router.url.split('?')[0].split('#')[0]}`;

    // =====================================================
    // PROGRAM DETAILS
    // =====================================================
    const programName =
      program?.PrimaryCourseName ||
      program?.ProgramName ||
      program?.sfullname ||
      pageData?.ProgramName ||
      pageData?.Title ||
      'Industry Integrated UG Program';

    const courseCode =
      program?.sCourseCode ||
      program?.CourseCode ||
      program?.CourseCD ||
      this.programCD ||
      '';

    const description = this.stripHtml(
      pageData?.Description ||
        program?.Description ||
        program?.CourseDescription ||
        program?.sshortdesc ||
        'A specialised undergraduate programme combining academic learning with real-world industry exposure at Amity University Noida.',
    );

    const degreeName =
      program?.DegreeName ||
      program?.Degree ||
      program?.sDegree ||
      pageData?.DegreeName ||
      programName;

    const duration =
      program?.Duration ||
      program?.sDuration ||
      program?.CourseDuration ||
      pageData?.Duration ||
      '';

    const eligibility = this.stripHtml(
      program?.Eligibility ||
        program?.sEligibility ||
        program?.EligibilityCriteria ||
        program?.MinimumEligibility ||
        pageData?.Eligibility ||
        '',
    );

    const disciplineName =
      program?.DisciplineName ||
      program?.Discipline ||
      program?.sDiscipline ||
      pageData?.DisciplineName ||
      'Undergraduate Programmes';

    // =====================================================
    // DURATION -> ISO 8601
    // 4 Years -> P4Y
    // 36 Months -> P36M
    // =====================================================
    let isoDuration = '';

    if (duration) {
      const durationText = duration.toString().toLowerCase();

      const yearMatch = durationText.match(/(\d+)\s*(year|years|yr|yrs)/i);

      const monthMatch = durationText.match(/(\d+)\s*(month|months)/i);

      if (yearMatch) {
        isoDuration = `P${yearMatch[1]}Y`;
      } else if (monthMatch) {
        isoDuration = `P${monthMatch[1]}M`;
      }
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
    // WEBPAGE
    // =====================================================
    const webPageSchema = {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,

      url: pageUrl,

      name: programName,

      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },

      about: [
        {
          '@id': `${pageUrl}#course`,
        },
        {
          '@id': `${pageUrl}#programme`,
        },
      ],

      breadcrumb: {
        '@id': `${pageUrl}#breadcrumb`,
      },

      inLanguage: 'en-IN',
    };

    // =====================================================
    // COURSE
    // =====================================================
    const courseSchema: any = {
      '@type': 'Course',

      '@id': `${pageUrl}#course`,

      url: pageUrl,

      name: programName,

      description: description,

      provider: {
        '@id': `${baseUrl}/#university`,
      },

      educationalCredentialAwarded: degreeName,

      hasCourseInstance: {
        '@type': 'CourseInstance',

        '@id': `${pageUrl}#course-instance`,

        name: `${programName} – Full-time`,

        courseMode: 'Full-time',

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
      },

      mainEntityOfPage: {
        '@id': `${pageUrl}#webpage`,
      },

      inLanguage: 'en-IN',
    };

    // Course code
    if (courseCode) {
      courseSchema.courseCode = courseCode.toString();
    }

    // Duration
    if (isoDuration) {
      courseSchema.timeRequired = isoDuration;

      courseSchema.hasCourseInstance.courseWorkload = isoDuration;
    }

    // Eligibility
    if (eligibility) {
      courseSchema.coursePrerequisites = eligibility;
    }

    // =====================================================
    // EDUCATIONAL PROGRAMME
    // =====================================================
    const programmeSchema: any = {
      '@type': 'EducationalOccupationalProgram',

      '@id': `${pageUrl}#programme`,

      url: pageUrl,

      name: programName,

      programType: 'Undergraduate degree programme',

      educationalCredentialAwarded: degreeName,

      provider: {
        '@id': `${baseUrl}/#university`,
      },
    };

    if (isoDuration) {
      programmeSchema.timeToComplete = isoDuration;
    }

    if (eligibility) {
      programmeSchema.programPrerequisites = eligibility;
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
          name: 'Undergraduate Programmes',
          item: `${baseUrl}/ug`,
        },

        {
          '@type': 'ListItem',
          position: 3,
          name: disciplineName,
          item: pageUrl,
        },

        {
          '@type': 'ListItem',
          position: 4,
          name: programName,
          item: pageUrl,
        },
      ],
    };

    // =====================================================
    // FAQ
    // =====================================================

    const faqPairs = [
      {
        q: program?.FaqQuestion,
        a: program?.FaqAnswer,
      },
      {
        q: program?.FaqQuestion2,
        a: program?.FaqAnswer2,
      },
      {
        q: program?.FaqQuestion3,
        a: program?.FaqAnswer3,
      },
      {
        q: program?.FaqQuestion4,
        a: program?.FaqAnswer4,
      },
      {
        q: program?.FaqQuestion5,
        a: program?.FaqAnswer5,
      },
    ];

    // Only include FAQs having BOTH question and answer
    const faqItems = faqPairs
      .filter(
        (faq) =>
          faq.q && faq.a && this.stripHtml(faq.q) && this.stripHtml(faq.a),
      )
      .map((faq) => ({
        '@type': 'Question',

        name: this.stripHtml(faq.q),

        acceptedAnswer: {
          '@type': 'Answer',

          text: this.stripHtml(faq.a),
        },
      }));

    // =====================================================
    // GRAPH
    // =====================================================

    const graph: any[] = [
      universitySchema,
      websiteSchema,
      webPageSchema,
      courseSchema,
      programmeSchema,
      breadcrumbSchema,
    ];

    // Add FAQPage only when FAQ data exists
    if (faqItems.length > 0) {
      graph.push({
        '@type': 'FAQPage',

        '@id': `${pageUrl}#faq`,

        mainEntity: faqItems,
      });

      // Connect FAQ with WebPage
      (webPageSchema as any).mainEntity = {
        '@id': `${pageUrl}#faq`,
      };
    }

    // =====================================================
    // FINAL JSON-LD
    // =====================================================

    const schema = {
      '@context': 'https://schema.org',

      '@graph': graph,
    };

    // =====================================================
    // REMOVE PREVIOUS JSON-LD
    // =====================================================

    const existingScript = document.getElementById('structured-data');

    if (existingScript) {
      existingScript.remove();
    }

    // =====================================================
    // ADD JSON-LD
    // =====================================================

    const script = document.createElement('script');

    script.type = 'application/ld+json';

    script.id = 'structured-data';

    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  // injectStructuredData(pageData: any): void {
  //   const baseUrl = 'https://noida.amity.edu';
  //   const pageUrl = pageData.CanonicalUrl || window.location.href;

  //   const programName =
  //     pageData.ProgramName ||
  //     pageData.Title ||
  //     'Industry Integrated UG Program';

  //   const schema = {
  //     '@context': 'https://schema.org',
  //     '@graph': [
  //       {
  //         '@type': ['EducationalOccupationalProgram', 'WebPage'],
  //         '@id': pageUrl,
  //         url: pageUrl,
  //         name: programName,
  //         description:
  //           pageData.Description ||
  //           'A specialised undergraduate program combining academic learning with real-world industry exposure.',
  //         programType: 'Undergraduate Program',
  //         occupationalCredentialAwarded:
  //           pageData.DegreeName || 'Bachelor Degree',
  //         provider: { '@id': `${baseUrl}/#university` },
  //         hasCourse: { '@id': `${pageUrl}#course-details` },
  //         breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
  //       },

  //       {
  //         '@type': 'Course',
  //         '@id': `${pageUrl}#course-details`,
  //         name: pageData.CourseName || 'Program Curriculum',
  //         description:
  //           pageData.CourseDescription ||
  //           'Course structure and semester-wise curriculum for the program.',
  //         provider: { '@id': `${baseUrl}/#university` },
  //       },

  //       {
  //         '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
  //         '@id': `${baseUrl}/#university`,
  //         name: 'Amity University Noida',
  //         url: `${baseUrl}/`,
  //         description:
  //           'A globally recognized institution offering world-class education across multiple disciplines.',
  //       },

  //       {
  //         '@type': 'BreadcrumbList',
  //         '@id': `${pageUrl}#breadcrumb`,
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
  //             name: 'Industry UG Programs',
  //             item: `${baseUrl}/industry-ug-details`,
  //           },
  //           {
  //             '@type': 'ListItem',
  //             position: 3,
  //             name: programName,
  //             item: pageUrl,
  //           },
  //         ],
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

  private setCanonicalLink(url: string) {
    // Remove any existing canonical link
    const link: HTMLLinkElement =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);

    // Append to head if it's a new element
    if (!link.parentNode) {
      document.head.appendChild(link);
    }
  }

  // Fetch UG program semester details based on the CourseCD
  getUgProgramDetailsSemester(ProgramCode: string): void {
    this.getUgSemesterDetails = [];
    this.groupedSemesters = {};
    this.isNewProgram = false;

    this.apiService.getAllUgProgramDetailsSemester(ProgramCode).subscribe({
      next: (data: any[]) => {
        if (data?.length) {
          data.sort(
            (a, b) => (a.iDisplayOrderAPW ?? 0) - (b.iDisplayOrderAPW ?? 0),
          );

          this.getUgSemesterDetails = data;

          this.isNewProgram = data[0].CourseCode === 'New';

          if (this.isNewProgram) {
            this.groupSemesterData(data);
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  groupSemesterData(data: any[]): void {
    const temp: any = {};
    this.groupedSemestersArray = {};

    // Group Semester -> Type -> Remarks
    data.forEach((item) => {
      const sem = item.Semester;
      const type = item.Type || 'Others';
      const remarks = item.Remarks || '';

      if (!temp[sem]) {
        temp[sem] = {};
      }

      if (!temp[sem][type]) {
        temp[sem][type] = {};
      }

      if (!temp[sem][type][remarks]) {
        temp[sem][type][remarks] = [];
      }

      temp[sem][type][remarks].push(item);
    });

    // Convert grouped object
    Object.keys(temp).forEach((semKey) => {
      const sem = +semKey;

      this.groupedSemestersArray[sem] = Object.keys(temp[sem]).map((type) => {
        const remarkGroups = Object.keys(temp[sem][type])
          .map((remark) => {
            const courses = temp[sem][type][remark].sort(
              (a: any, b: any) => a.SrNo - b.SrNo,
            );

            return {
              remarks: remark,
              courses: courses,
              minSrNo: courses[0].SrNo,
            };
          })
          .sort((a: any, b: any) => a.minSrNo - b.minSrNo);

        return {
          type: type,
          remarksGroup: remarkGroups,
        };
      });
    });
  }

  hasSemesterRange(start: number, end: number): boolean {
    return this.getUgSemesterDetails.some(
      (x) => x.Semester >= start && x.Semester <= end,
    );
  }

  // ✅ decide which tab should be active FIRST
  getFirstYearTab(): number {
    if (this.hasSemesterRange(1, 2)) return 1;
    if (this.hasSemesterRange(3, 4)) return 2;
    if (this.hasSemesterRange(5, 6)) return 3;
    if (this.hasSemesterRange(7, 8)) return 4;
    if (this.hasSemesterRange(9, 10)) return 5;
    return 1;
  }

  // Method to format faculty name for routing by handling multiple spaces and special characters
  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim() // Trim leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  }
}
