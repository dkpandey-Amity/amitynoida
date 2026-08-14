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
  selector: 'app-pg-3-continent-details',
  standalone: true,
  imports: [
    CleanHtmlPipe,
    RouterLink,
    CommonModule,
    CleanHtmlPtagPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pg-3-continent-details.component.html',
  styleUrl: './pg-3-continent-details.component.css',
})
export class Pg3ContinentDetailsComponent implements OnInit {
  GetPG3ContinentProgramsData: any[] = [];
  sDiscipline!: string;
  sCourseCode!: string;
  getPgSemesterDetails: any[] = [];
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

  isNewProgram = false;

  pageMetaData: any;

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

    this.apiService
      .getAllPgIndustryProgramsDetails(this.sCourseCode)
      .subscribe({
        next: (data: any[]) => {
          if (data && data.length > 0) {
            this.GetPG3ContinentProgramsData = data;

            this.GetPG3ContinentProgramsData.forEach((program: any) => {
              this.programCD = program.CourseCD;
              this.getPgProgramDetailsSemester(this.programCD);
            });

            // IMPORTANT:
            // Load meta + schema only after program data is available
            this.getAllUgProgramMetas();
          } else {
            console.error('No data found for the provided course code.');
          }
        },
        error: (error: any) => {
          console.error('Error fetching PG program details:', error);
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
        Coursecd: this.programCD, // <-- Pass CourseCD here
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
      stype: 'pg',
      scountrycode: formData.countryCode, // +91 or other country code
      spageurl: window.location.href,
    };

    //console.log(payload);

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

  hasSemesterRange(start: number, end: number): boolean {
    return this.getPgSemesterDetails.some(
      (x) => x.Semester >= start && x.Semester <= end,
    );
  }

  getFirstYearTab(): number {
    if (this.hasSemesterRange(1, 2)) return 1;
    if (this.hasSemesterRange(3, 4)) return 2;
    if (this.hasSemesterRange(5, 6)) return 3;
    if (this.hasSemesterRange(7, 8)) return 4;
    if (this.hasSemesterRange(9, 10)) return 5;
    return 1;
  }

  getAllUgProgramMetas(): void {
    this.sCourseCode = this.route.snapshot.params['SlugName'];

    this.apiService.getAllProgramMetas(this.sCourseCode).subscribe({
      next: (data: any[]) => {
        const pageData = data?.length ? data[0] : null;

        if (!pageData) {
          console.warn('No page meta data found');
          return;
        }

        const baseUrl = 'https://noida.amity.edu';

        // =====================================================
        // CANONICAL URL
        // =====================================================
        const pageUrl =
          pageData?.CanonicalUrl ||
          pageData?.canonicalUrl ||
          `${baseUrl}${this.router.url.split('?')[0].split('#')[0]}`;

        // =====================================================
        // PROGRAM DATA
        // =====================================================
        const program =
          this.GetPG3ContinentProgramsData?.length > 0
            ? this.GetPG3ContinentProgramsData[0]
            : null;

        const programName =
          program?.PrimaryCourseName ||
          program?.ProgramName ||
          program?.sfullname ||
          pageData?.ProgramName ||
          pageData?.Title ||
          'PG 3 Continent Program';

        const title =
          pageData?.Title || `${programName} | Amity University Noida`;

        const description =
          pageData?.Description ||
          program?.Description ||
          program?.CourseDescription ||
          'A globally immersive postgraduate programme offered by Amity University Noida.';

        // =====================================================
        // IMAGE
        // =====================================================
        const imageUrl = pageData?.ImageUrl
          ? pageData.ImageUrl.startsWith('http')
            ? pageData.ImageUrl
            : `${baseUrl}/${pageData.ImageUrl.replace(/^\/+/, '')}`
          : `${baseUrl}/assets/img/breadcrump_bg.jpg`;

        // =====================================================
        // TITLE
        // =====================================================
        this.titleService.setTitle(title);

        // =====================================================
        // BASIC META
        // =====================================================
        this.meta.updateTag({
          name: 'description',
          content: description,
        });

        if (pageData?.Keywords) {
          this.meta.updateTag({
            name: 'keywords',
            content: pageData.Keywords,
          });
        }

        // =====================================================
        // OPEN GRAPH
        // =====================================================
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
          content: programName,
        });

        // =====================================================
        // TWITTER / X
        // =====================================================
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

        // =====================================================
        // CANONICAL
        // =====================================================
        this.setCanonicalLink(pageUrl);

        // =====================================================
        // STRUCTURED DATA
        // =====================================================
        this.injectStructuredData(pageData);
      },

      error: (error: any) => {
        console.error('Error fetching program meta data:', error);
      },
    });
  }

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';

    // =====================================================
    // PROGRAM
    // =====================================================
    const program =
      this.GetPG3ContinentProgramsData?.length > 0
        ? this.GetPG3ContinentProgramsData[0]
        : null;

    if (!program) {
      console.warn('Program data not available for structured data');
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
    // PROGRAM NAME
    // =====================================================
    const programName =
      program?.PrimaryCourseName ||
      program?.ProgramName ||
      program?.sfullname ||
      pageData?.ProgramName ||
      pageData?.Title ||
      'PG 3 Continent Program';

    // =====================================================
    // COURSE CODE
    // =====================================================
    const courseCode =
      program?.sCourseCode ||
      program?.CourseCode ||
      program?.CourseCD ||
      this.programCD ||
      '';

    // =====================================================
    // DESCRIPTION
    // =====================================================
    const description =
      pageData?.Description ||
      program?.Description ||
      program?.CourseDescription ||
      'A postgraduate programme offering globally focused academic learning at Amity University Noida.';

    // =====================================================
    // DEGREE
    // =====================================================
    const degreeName =
      program?.DegreeName ||
      program?.Degree ||
      pageData?.DegreeName ||
      programName;

    // =====================================================
    // DURATION
    // =====================================================
    const duration =
      program?.Duration || program?.CourseDuration || pageData?.Duration || '';

    // =====================================================
    // ELIGIBILITY
    // =====================================================
    const eligibility =
      program?.Eligibility ||
      program?.EligibilityCriteria ||
      pageData?.Eligibility ||
      '';

    // =====================================================
    // DISCIPLINE
    // =====================================================
    const disciplineName =
      program?.DisciplineName ||
      program?.Discipline ||
      pageData?.DisciplineName ||
      'Postgraduate Programmes';

    // =====================================================
    // DURATION -> ISO 8601
    // =====================================================
    let isoDuration = '';

    if (duration) {
      const durationText = duration.toString().toLowerCase();

      const yearMatch = durationText.match(
        /(\d+(?:\.\d+)?)\s*(year|years|yr|yrs)/i,
      );

      const monthMatch = durationText.match(/(\d+)\s*(month|months)/i);

      if (yearMatch) {
        const years = Number(yearMatch[1]);

        if (Number.isInteger(years)) {
          isoDuration = `P${years}Y`;
        } else {
          const months = Math.round(years * 12);
          isoDuration = `P${months}M`;
        }
      } else if (monthMatch) {
        isoDuration = `P${monthMatch[1]}M`;
      }
    }

    // =====================================================
    // GRAPH
    // =====================================================
    const graph: any[] = [];

    // =====================================================
    // 1. UNIVERSITY
    // =====================================================
    graph.push({
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
    });

    // =====================================================
    // 2. WEBSITE
    // =====================================================
    graph.push({
      '@type': 'WebSite',

      '@id': `${baseUrl}/#website`,

      url: `${baseUrl}/`,

      name: 'Amity University Noida',

      publisher: {
        '@id': `${baseUrl}/#university`,
      },

      inLanguage: 'en-IN',
    });

    // =====================================================
    // 3. WEB PAGE
    // =====================================================
    graph.push({
      '@type': 'WebPage',

      '@id': `${pageUrl}#webpage`,

      url: pageUrl,

      name: programName,

      description: description,

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

      mainEntity: {
        '@id': `${pageUrl}#course`,
      },

      inLanguage: 'en-IN',
    });

    // =====================================================
    // 4. COURSE
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

    // Add only when data exists
    if (courseCode) {
      courseSchema.courseCode = courseCode.toString();
    }

    if (isoDuration) {
      courseSchema.timeRequired = isoDuration;

      courseSchema.hasCourseInstance.courseWorkload = isoDuration;
    }

    if (eligibility) {
      courseSchema.coursePrerequisites = eligibility;
    }

    graph.push(courseSchema);

    // =====================================================
    // 5. EDUCATIONAL OCCUPATIONAL PROGRAM
    // =====================================================
    const programmeSchema: any = {
      '@type': 'EducationalOccupationalProgram',

      '@id': `${pageUrl}#programme`,

      url: pageUrl,

      name: programName,

      description: description,

      programType: 'Postgraduate 3 Continent degree programme',

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

    graph.push(programmeSchema);

    // =====================================================
    // 6. BREADCRUMB
    // =====================================================
    graph.push({
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
          name: 'Postgraduate Programmes',
          item: `${baseUrl}/pg`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'PG 3 Continent Programs',
          item: `${baseUrl}/pg-3-continent`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: programName,
          item: pageUrl,
        },
      ],
    });

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
    // CREATE JSON-LD SCRIPT
    // =====================================================
    const script = document.createElement('script');

    script.id = 'structured-data';

    script.type = 'application/ld+json';

    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  // injectStructuredData(pageData: any): void {
  //   const baseUrl = 'https://noida.amity.edu';
  //   const pageUrl =
  //     pageData.CanonicalUrl || `${baseUrl}/pg-3-continent/${this.sCourseCode}`;

  //   const schema = {
  //     '@context': 'https://schema.org',
  //     '@graph': [
  //       {
  //         '@type': ['EducationalOccupationalProgram', 'WebPage'],
  //         '@id': pageUrl,
  //         url: pageUrl,
  //         name: pageData.Title || 'MBA – PG 3 Continent Program',
  //         description:
  //           pageData.Description ||
  //           'A specialized MBA program with study opportunities across three continents.',
  //         programType: 'Postgraduate 3 Continent Program',
  //         provider: { '@id': `${baseUrl}#college` },
  //         hasCourse: { '@id': `${pageUrl}#course-details` },
  //         occupationalCredentialAwarded: 'Master of Business Administration',
  //         breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
  //       },

  //       {
  //         '@type': 'Course',
  //         '@id': `${pageUrl}#course-details`,
  //         name: 'Global Business Management',
  //         description:
  //           'Course covering international market practices and cross-continent business environments.',
  //         provider: { '@id': `${baseUrl}#college` },
  //       },

  //       {
  //         '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
  //         '@id': `${baseUrl}#college`,
  //         name: 'Amity University Noida',
  //         url: baseUrl,
  //         logo: `${baseUrl}/assets/images/amity-logo.png`,
  //         foundingDate: '2005',
  //         description:
  //           'Amity University is a leading private university in India offering globally benchmarked education.',
  //         address: {
  //           '@type': 'PostalAddress',
  //           streetAddress: 'Sector 125',
  //           addressLocality: 'Noida',
  //           addressRegion: 'Uttar Pradesh',
  //           postalCode: '201301',
  //           addressCountry: 'IN',
  //         },
  //       },

  //       {
  //         '@type': 'BreadcrumbList',
  //         '@id': `${pageUrl}#breadcrumb`,
  //         itemListElement: [
  //           {
  //             '@type': 'ListItem',
  //             position: 1,
  //             name: 'Home',
  //             item: baseUrl,
  //           },
  //           {
  //             '@type': 'ListItem',
  //             position: 2,
  //             name: 'PG 3 Continent Programs',
  //             item: `${baseUrl}/pg-3-continent`,
  //           },
  //           {
  //             '@type': 'ListItem',
  //             position: 3,
  //             name: pageData.Title || 'MBA – PG 3 Continent Program',
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

  private setCanonicalLink(url: string): void {
    let link = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement('link');

      link.rel = 'canonical';

      document.head.appendChild(link);
    }

    link.href = url;
  }

  // Fetch UG program semester details based on the CourseCD
  getPgProgramDetailsSemester(programCode: string): void {
    this.getPgSemesterDetails = [];
    this.groupedSemestersArray = {};
    this.isNewProgram = false;

    this.apiService.getAllPgProgramDetailsSemester(programCode).subscribe({
      next: (data: any[]) => {
        if (!data?.length) return;

        // Global Sort
        data.sort(
          (a, b) =>
            (a.iDisplayOrderAPW ?? a.SrNo ?? 0) -
            (b.iDisplayOrderAPW ?? b.SrNo ?? 0),
        );

        this.getPgSemesterDetails = data;

        this.isNewProgram = data[0].CourseCode === 'New';

        if (this.isNewProgram) {
          this.groupSemesterData(data);
        }
      },
      error: (err) => console.error(err),
    });
  }

  // ================= GROUP + SORT =================
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
}
