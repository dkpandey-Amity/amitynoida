import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../service/noidaweb.service';
import {
  LandingserviceService,
  OtpResponse,
} from '../service/landingservice.service';

@Component({
  selector: 'app-enquiryform',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './enquiryform.component.html',
  styleUrl: './enquiryform.component.css',
})
export class EnquiryformComponent implements OnInit, OnDestroy {
  brochureForm!: FormGroup;
  showBrochurePopup = false;
  countryCodes: string[] = [];

  // OTP Properties
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
    private fb: FormBuilder,
    private landingService: LandingserviceService,
  ) {}

  ngOnInit(): void {
    this.loadCountryCodes();

    this.brochureForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      otp: [''],
      authorization: [true, Validators.requiredTrue],
    });

    // Change validation according to country
    this.brochureForm.get('countryCode')?.valueChanges.subscribe((code) => {
      const phoneCtrl = this.brochureForm.get('phone');
      if (code === '+91') {
        phoneCtrl?.setValidators([
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/),
        ]);
      } else {
        phoneCtrl?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6,15}$/),
        ]);
      }
      phoneCtrl?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
    }
  }

  // Open Brochure Popup
  openBrochurePopup(): void {
    this.showBrochurePopup = true;
    // Reset form state when opening
    this.resetFormState();
  }

  // Close Brochure Popup
  closeBrochurePopup(): void {
    this.showBrochurePopup = false;
    this.resetFormState();
  }

  // Reset form state
  resetFormState(): void {
    this.otpSent = false;
    this.otpVerified = false;
    this.otpStatus = '';
    this.otpMessage = '';
    this.loginNo = '';
    this.formNo = '';
    this.otpTimer = 0;
    this.isSubmitting = false;

    if (this.otpInterval) {
      clearInterval(this.otpInterval);
      this.otpInterval = null;
    }

    // Enable all controls
    this.brochureForm.enable({
      emitEvent: false,
    });

    // Reset form
    this.brochureForm.reset(
      {
        name: '',
        email: '',
        countryCode: '+91',
        phone: '',
        otp: '',
        authorization: true, // Checked by default after reset
      },
      {
        emitEvent: false,
      },
    );
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
      .enquirysendOtp({
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
    if (this.otpTimer > 0 || this.isSubmitting) {
      return;
    }

    if (this.isIndian) {
      this.brochureForm.get('phone')?.enable();
    } else {
      this.brochureForm.get('email')?.enable();
    }

    this.sendOtp();
  }

  verifyOtp(): void {
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
    if (!/^\d{4}$/.test(otp)) {
      return;
    }
    if (this.otpVerified || this.isSubmitting) {
      return;
    }
    this.verifyOtp();
  }

  submitBrochureForm(): void {
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
      Phone: formData.phone,
      Message: 'Enquiry Form',
      scoursecode: '',
      stype: 'EnquiryForm',
      scountrycode: formData.countryCode,
      spageurl: window.location.href,
    };

    this.isSubmitting = true;

    this.apiService.allCourseSubmitEnquiryForm(payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.closeBrochurePopup();

        alert('Enquiry form submitted successfully!');
      },

      error: (err) => {
        this.isSubmitting = false;

        console.error('API Error:', err);
      },
    });
  }
  // allCourseSubmitEnquiryFormfooter
}
