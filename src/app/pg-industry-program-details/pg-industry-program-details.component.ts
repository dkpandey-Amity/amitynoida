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

@Component({
  selector: 'app-pg-industry-program-details',
  standalone: true,
  imports: [
    CleanHtmlPipe,
    RouterLink,
    CommonModule,
    CleanHtmlPtagPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pg-industry-program-details.component.html',
  styleUrl: './pg-industry-program-details.component.css',
})
export class PgIndustryProgramDetailsComponent implements OnInit {
  GetIndustryPGProgramsData: any[] = [];
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
    
    this.getAllUgProgramMetas();
    this.sCourseCode = this.route.snapshot.params['SlugName'];
    //this.sCourseCode = history.state.code;

    this.apiService
      .getAllPgIndustryProgramsDetails(this.sCourseCode)
      .subscribe({
        next: (data: any[]) => {
          if (data && data.length > 0) {
            this.GetIndustryPGProgramsData = data;
            this.GetIndustryPGProgramsData.forEach((program: any) => {
              this.programCD = program.CourseCD;
              this.getPgProgramDetailsSemester(this.programCD);
            });
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
      stype: 'pg',
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
          const pageUrl = pageData.canonicalUrl || window.location.href;

          const program =
            this.GetIndustryPGProgramsData &&
            this.GetIndustryPGProgramsData.length > 0
              ? this.GetIndustryPGProgramsData[0]
              : null;

          const title =
            pageData.Title || program?.ProgramName || 'Industry PG Program';

          const description =
            pageData.Description ||
            'Industry-integrated postgraduate program with strong corporate collaboration and real-world exposure.';

          const imageUrl = pageData.ImageUrl
            ? `https://noida.amity.edu/${pageData.ImageUrl}`
            : 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          // ================= Open Graph Meta Tags =================
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

          // ================= Twitter (X) Meta Tags =================
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

  injectStructuredData(pageData: any): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: pageData.CanonicalUrl || window.location.href,
      name: pageData.Title || 'Amity University Noida',
      headline: pageData.Title || 'Amity University Noida | Amity Noida',
      image: {
        '@type': 'ImageObject',
        url: 'https://noida.amity.edu/assets/img/amity-logo.png',
      },
      author: {
        '@type': 'Organization',
        name: 'Best University in Noida',
      },
      keywords: (pageData.Keywords || 'Amity University Noida').split(','),
      description: pageData.Description || 'Amity University Noida',
      Text: pageData.Description || 'Amity University Noida',
    };

    // Remove existing schema if present
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append new script tag
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
