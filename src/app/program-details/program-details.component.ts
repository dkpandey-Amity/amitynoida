import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/noidaweb.service';
import { CleanHtmlPipe } from '../custompipe/clean-html.pipe';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { CleanHtmlPtagPipe } from '../service/clean-htmlptag.pipe';
import {
  LandingserviceService,
  OtpResponse,
} from '../service/landingservice.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CleanHtmlPipe,
    CleanHtmlPtagPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.css'],
})
export class ProgramDetailsComponent implements OnInit {
  getUgProgramData: any[] = [];
  sDiscipline!: string;
  SlugName!: string;
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

    this.route.params.subscribe((params) => {
      const discipline = params['Disciplineslugname'];
      const programSlug = params['SlugName'];

      this.loadProgram(discipline, programSlug);
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
        Coursecd: this.programCD, // <-- Pass CourseCD here
        target,
      })
      .subscribe({
        next: (res: OtpResponse) => {
          this.isSubmitting = false;
          //console.log('OTP Response:', res);

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
          this.otpSent = false;
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
      stype: 'g',
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

  loadProgram(discipline: string, programSlug: string): void {
    this.apiService
      .getAllUgProgramsDetails(discipline, programSlug)
      .subscribe((data: any[]) => {
        if (!data?.length) return;

        //console.log('data:', data);

        // ✅ FIND CORRECT PROGRAM (IMPORTANT FIX)
        const program = data.find(
          (x: any) =>
            x.SlugName?.toLowerCase() === programSlug.toLowerCase() ||
            x.OldUrl?.toLowerCase() === programSlug.toLowerCase(),
        );

        if (!program) {
          console.warn('Program not found');
          return;
        }

        const newUrl = program.NewUrl?.toLowerCase();
        const oldUrl = program.OldUrl?.toLowerCase();
        const current = programSlug?.toLowerCase();

        // ✅ ONLY OLD → NEW
        if (oldUrl && newUrl && current === oldUrl) {
          this.router.navigate(['/ug', discipline, newUrl], {
            replaceUrl: true,
          });
          return;
        }

        // ✅ SET ONLY MATCHED PROGRAM
        this.getUgProgramData = [program];
        this.programCD = program.CourseCD;

        this.getUgProgramDetailsSemester(this.programCD);

        this.getAllUgProgramMetas();
      });
  }

  // ngOnInit(): void {
  //   const discipline = this.route.snapshot.params['Disciplineslugname'];
  //   const programSlug = this.route.snapshot.params['SlugName'];

  //   this.apiService
  //     .getAllUgProgramsDetails(discipline, programSlug)
  //     .subscribe((data: any[]) => {
  //       if (data?.length) {
  //         const program = data[0];

  //         const newUrl = program.NewUrl?.toLowerCase();
  //         const current = programSlug?.toLowerCase();

  //         // 🔥 FORCE CANONICAL URL
  //         if (newUrl && current !== newUrl) {
  //           this.router.navigate(['/ug', discipline, newUrl], {
  //             replaceUrl: true,
  //           });
  //           return;
  //         }

  //         console.log('current:', current);
  //         console.log('OldUrl:', program.OldUrl);
  //         console.log('NewUrl:', newUrl);

  //         // ✅ normal
  //         this.getUgProgramData = data;
  //         this.programCD = program.CourseCD;
  //         this.getUgProgramDetailsSemester(this.programCD);
  //       }
  //     });
  // }

  // ngOnInit(): void {
  //   this.getAllUgProgramMetas();

  //   const discipline = this.route.snapshot.params['Disciplineslugname']; // or Disciplineslugname (check your route)
  //   const programSlug = this.route.snapshot.params['SlugName'];

  //   this.apiService.getAllUgProgramsDetails(discipline, programSlug).subscribe({
  //     next: (data: any[]) => {
  //       if (data?.length) {
  //         this.getUgProgramData = data;

  //         this.programCD = data[0].CourseCD;
  //         this.getUgProgramDetailsSemester(this.programCD);
  //       }
  //     },
  //     error: (err) => console.error(err),
  //   });
  //}

  // this.sCourseCode = this.route.snapshot.params['SlugName'];

  // this.apiService.getAllUgProgramsDetails(this.sCourseCode).subscribe({
  //   next: (data: any[]) => {
  //     if (data?.length) {
  //       this.getUgProgramData = data;

  //       // ✅ take FIRST program only
  //       this.programCD = data[0].CourseCD;
  //       this.getUgProgramDetailsSemester(this.programCD);
  //     }
  //   },
  //   error: (err) => console.error(err),
  // });

  // ✅ check if semester data exists for a year
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

  getAllUgProgramMetas() {
    this.sCourseCode = this.route.snapshot.params['SlugName'];
    this.apiService.getAllProgramMetas(this.sCourseCode).subscribe({
      next: (data: any[]) => {
        const pageData = data && data.length > 0 ? data[0] : null;
        if (pageData) {
          this.titleService.setTitle(pageData.Title || 'Default Title');
          this.meta.updateTag({
            name: 'description',
            content: pageData.Description || 'Default description',
          });
          this.meta.updateTag({
            name: 'keywords',
            content: pageData.Keywords || 'default, keywords',
          });

          const discipline = this.route.snapshot.params['Disciplineslugname'];

          const slug = this.route.snapshot.params['SlugName'];

          const baseUrl = 'https://noida.amity.edu';

          const section = this.route.snapshot.url[0]?.path; // ug / pg

          const canonicalUrl =
            pageData?.canonical ||
            `${baseUrl}/${section}/${discipline}/${slug}`;

          // ================= Open Graph + Twitter =================

          // Prepare dynamic values
          const program = this.getUgProgramData?.[0];

          const title = pageData?.Title || program?.sfullname || 'UG Program';

          const description =
            pageData?.Description ||
            program?.sshortdesc ||
            'Explore undergraduate program at Amity University Noida.';

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
            content: canonicalUrl,
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

          this.setCanonicalLink(canonicalUrl);

          this.injectStructuredData(pageData);
        } else {
          console.warn('No page data found');
        }
      },
    });
  }

  private stripHtml(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent?.trim() || '';
  }

  injectStructuredData(pageData: any): void {
    const baseUrl = 'https://noida.amity.edu';

    const program = this.getUgProgramData?.[0];
    if (!program) return;

    // ✅ FIX 1: fallback for discipline slug
    const disciplineSlug =
      this.route.snapshot.params['discipline'] ||
      program?.Disciplineslugname ||
      'engineering';

    // ✅ FIX 2: program slug
    const programSlug =
      this.route.snapshot.params['SlugName'] || program?.SlugName;

    // ✅ FIX 3: canonical URL
    const canonicalUrl =
      pageData.CanonicalUrl || `${baseUrl}/ug/${disciplineSlug}/${programSlug}`;

    /* ================= FAQ SCHEMA ================= */
    let faqItems: any[] = [];

    const faqPairs = [
      { q: program.FaqQuestion, a: program.FaqAnswer },
      { q: program.FaqQuestion2, a: program.FaqAnswer2 },
      { q: program.FaqQuestion3, a: program.FaqAnswer3 },
      { q: program.FaqQuestion4, a: program.FaqAnswer4 },
      { q: program.FaqQuestion5, a: program.FaqAnswer5 },
    ];

    faqItems = faqPairs
      .filter((faq) => faq.q && faq.a)
      .map((faq) => ({
        '@type': 'Question',
        name: this.stripHtml(faq.q),
        acceptedAnswer: {
          '@type': 'Answer',
          text: this.stripHtml(faq.a),
        },
      }));

    const faqSchema = faqItems.length
      ? {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: faqItems,
        }
      : null;

    /* ================= MAIN GRAPH ================= */
    const graph: any[] = [
      {
        '@type': ['EducationalOccupationalProgram', 'WebPage'],
        '@id': canonicalUrl,
        url: canonicalUrl,
        name: pageData.Title || program.sfullname,
        description: pageData.Description,
        programType: 'Undergraduate Programme',
        provider: { '@id': `${baseUrl}#university` },
        hasCourse: { '@id': `${canonicalUrl}#course-details` },
        occupationalCredentialAwarded: program.sDegree || 'Bachelor’s Degree',
        breadcrumb: {
          '@id': `${canonicalUrl}#breadcrumb`,
        },
      },

      {
        '@type': 'Course',
        '@id': `${canonicalUrl}#course-details`,
        name: program.PrimaryCourseName || program.sfullname,
        description:
          program.sshortdesc ||
          'Core curriculum and academic structure of the programme.',
        provider: { '@id': `${baseUrl}#university` },
      },

      {
        '@type': [
          'CollegeOrUniversity',
          'EducationalOrganization',
          'Organization',
        ],
        '@id': `${baseUrl}#university`,
        name: 'Amity University Noida',
        url: `${baseUrl}/`,
        description:
          'A leading university offering industry-oriented undergraduate programs.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sector 125',
          addressLocality: 'Noida',
          addressRegion: 'Uttar Pradesh',
          postalCode: '201313',
          addressCountry: 'IN',
        },
      },

      /* ================= ✅ FIXED BREADCRUMB ================= */
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`, // ✅ FIX (slash)
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'UG Programs',
            item: `${baseUrl}/ug`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: program.sDiscipline,
            item: `${baseUrl}/ug/${disciplineSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: program.sfullname,
            item: canonicalUrl,
          },
        ],
      },
    ];

    if (faqSchema) {
      graph.push(faqSchema);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@graph': graph,
    };

    const existingScript = document.getElementById('structured-data');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema);

    document.head.appendChild(script);
  }

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
  // getUgProgramDetailsSemester(ProgramCode: string): void {
  //   // reset state
  //   this.getUgSemesterDetails = [];
  //   this.groupedSemesters = {};
  //   this.isNewProgram = false;

  //   this.apiService.getAllUgProgramDetailsSemester(ProgramCode).subscribe({
  //     next: (data: any[]) => {
  //       if (data?.length) {
  //         // ✅ SORT BY iDisplayOrderAPW
  //         data.sort(
  //           (a, b) => (a.iDisplayOrderAPW ?? 0) - (b.iDisplayOrderAPW ?? 0),
  //         );

  //         this.getUgSemesterDetails = data;

  //         // 🔥 PROGRAM BASED DECISION
  //         this.isNewProgram = data[0].CourseCode === 'New';

  //         if (this.isNewProgram) {
  //           this.groupSemesterData(data);
  //         }
  //       }
  //     },
  //     error: (err) => console.error(err),
  //   });
  // }

  // groupSemesterData(data: any[]): void {
  //   this.groupedSemestersArray = {};

  //   const temp: Record<number, Record<string, any[]>> = {};

  //   // Group by Semester → Type
  //   data.forEach((item) => {
  //     const sem = item.Semester;
  //     const type = item.Type || 'Others';

  //     if (!temp[sem]) temp[sem] = {};
  //     if (!temp[sem][type]) temp[sem][type] = [];

  //     temp[sem][type].push(item);
  //   });

  //   // Sort courses & types by SrNo
  //   Object.keys(temp).forEach((semKey) => {
  //     const sem = +semKey;

  //     const typeArray = Object.keys(temp[sem]).map((type) => {
  //       const courses = temp[sem][type].sort((a, b) => a.SrNo - b.SrNo);

  //       return {
  //         type,
  //         minSrNo: courses[0].SrNo,
  //         courses,
  //       };
  //     });

  //     // Sort TYPES by SrNo
  //     this.groupedSemestersArray[sem] = typeArray.sort(
  //       (a, b) => a.minSrNo - b.minSrNo,
  //     );
  //   });
  // }

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
