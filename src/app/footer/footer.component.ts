import { Component, AfterViewInit } from '@angular/core';
import $ from 'jquery';
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
import { Course } from '../service/course.model';
import { ChatboatComponent } from '../chatboat/chatboat.component';
import { EnquiryformComponent } from "../enquiryform/enquiryform.component";

declare var bootstrap: any;

type FooterPanel =
  | 'ug'
  | 'pg'
  | 'phd'
  | 'resources'
  | 'admission'
  | 'academics'
  | 'placements';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule, EnquiryformComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  selectedProgramType: string = 'G';
  selectedProgram: any;
  displayedPrograms: any[] = [];
  //contactForm: FormGroup;
  countryCodes: any[] = [];

  ugPrograms: Course[] = [];
  pgPrograms: Course[] = [];
  phdPrograms: Course[] = [];

  showFooterLinks = false;

  activePanel: FooterPanel | null = 'ug';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    // this.contactForm = this.fb.group({
    //   Name: ['', [Validators.required, Validators.minLength(2)]],
    //   Email: ['', [Validators.required, Validators.email]],
    //   Phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    //   Message: ['Amity'],
    //   stype: ['', [Validators.required]],
    //   scoursecode: ['', [Validators.required]],
    //   scountrycode: [''],
    // });
  }

  // toggle(panel: FooterPanel) {
  //   this.activePanel = this.activePanel === panel ? null : panel;
  // }

  // toggleFooterLinks() {
  //   this.showFooterLinks = !this.showFooterLinks;
  // }

  // ngOnInit(): void {
  //   //this.onProgramTypeChange(undefined, this.selectedProgramType); // Pass undefined for the event to initialize courses
  //   //this.GetAllCountryCode();
  //   this.loadUG();
  //   this.loadPG();
  //   this.loadPhd();
  // }

  // loadUG() {
  //   this.apiService.GetAllCoursewithoutDiscipline().subscribe((res) => {
  //     this.ugPrograms = res;
  //   });
  // }

  // loadPG() {
  //   this.apiService.GetAllPgCoursewithoutDiscipline().subscribe((res) => {
  //     this.pgPrograms = res;
  //   });
  // }

  // loadPhd() {
  //   this.apiService.GetPhdCourseWithoutDeiscipline().subscribe((res) => {
  //     this.phdPrograms = res;
  //   });
  // }

  // onProgramTypeChange(event: Event | undefined, stype: string): void {
  //   if (stype === 'G') {
  //     this.GetAllDisciplineCourse();
  //   } else if (stype === 'PG') {
  //     this.GetPgCoursewithoutDiscipline();
  //   }
  // }

  // GetAllCountryCode(): void {
  //   this.apiService.GetCountryCode().subscribe((data: any) => {
  //     if (Array.isArray(data) && data.length > 0) {
  //       this.countryCodes = data;

  //       const defaultCountry =
  //         this.countryCodes.find((item) => item.phone_code === '91') ||
  //         this.countryCodes[0];

  //       if (defaultCountry) {
  //         this.contactForm.patchValue({
  //           scountrycode: defaultCountry.phone_code,
  //         });
  //       }
  //     }
  //   });
  // }

  // GetAllDisciplineCourse(): void {
  //   this.apiService.GetUgEnquiryformCourses().subscribe(
  //     (data: any[]) => {
  //       this.displayedPrograms = this.formatPrograms(data, 'G');
  //       if (this.displayedPrograms.length > 0) {
  //         this.selectedProgram = this.displayedPrograms[0].value;
  //         this.contactForm.patchValue({ scoursecode: this.selectedProgram });
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching UG courses:', error);
  //     },
  //   );
  // }

  // GetPgCoursewithoutDiscipline(): void {
  //   this.apiService.GetPgEnquiryformCourses().subscribe(
  //     (data: any[]) => {
  //       this.displayedPrograms = this.formatPrograms(data, 'PG');
  //       if (this.displayedPrograms.length > 0) {
  //         this.selectedProgram = this.displayedPrograms[0].value; // Set the default to the first PG program
  //         this.contactForm.patchValue({ scoursecode: this.selectedProgram }); // Update form value
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching PG courses:', error);
  //     },
  //   );
  // }

  // Format the program data for display in the select dropdown
  // private formatPrograms(data: any[], stype: string): any[] {
  //   return data.map((item: any) => ({
  //     value: item.sCourseCode,
  //     sfullname: `${item.sfullname || 'Unnamed Program'}`,
  //   }));
  // }

  // onSubmit() {
  //   if (this.contactForm.valid) {
  //     const formData = this.contactForm.value;

  //     this.apiService.postEnquiryForm(formData).subscribe({
  //       next: (response: any) => {
  //         this.toastr.success('Form submitted successfully!', 'Success');
  //         alert('Form Submitted Successfully');
  //         const enquiryModal = document.getElementById('enquiryNow');
  //         const modalInstance = bootstrap.Modal.getInstance(enquiryModal);
  //         modalInstance.hide();
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

  // ngAfterViewInit(): void {
  //   $(document).ready(() => {
  //     const progressPath = document.querySelector(
  //       '.progress-wrap path',
  //     ) as SVGPathElement | null;

  //     if (progressPath) {
  //       const pathLength = progressPath.getTotalLength();

  //       progressPath.style.transition = progressPath.style.webkitTransition =
  //         'none';
  //       progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
  //       progressPath.style.strokeDashoffset = `${pathLength}`;
  //       progressPath.getBoundingClientRect();
  //       progressPath.style.transition = progressPath.style.webkitTransition =
  //         'stroke-dashoffset 10ms linear';

  //       const updateProgress = () => {
  //         const scroll = $(window).scrollTop() || 0;
  //         const height =
  //           ($(document).height() || 0) - ($(window).height() || 0);
  //         const progress = pathLength - (scroll * pathLength) / height;
  //         progressPath.style.strokeDashoffset = `${progress}`;
  //       };

  //       updateProgress();
  //       $(window).scroll(updateProgress);

  //       const offset = 50;
  //       const duration = 550;

  //       $(window).on('scroll', () => {
  //         if ($(window).scrollTop()! > offset) {
  //           $('.progress-wrap').addClass('active-progress');
  //         } else {
  //           $('.progress-wrap').removeClass('active-progress');
  //         }
  //       });

  //       $('.progress-wrap').on('click', (event) => {
  //         event.preventDefault();
  //         $('html, body').animate({ scrollTop: 0 }, duration);
  //         return false;
  //       });
  //     }
  //   });
  // }

  // formatFacultyName(sfullname: string): string {
  //   return sfullname
  //     .trim() // Trim leading and trailing spaces
  //     .toLowerCase() // Convert to lowercase
  //     .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
  //     .replace(/[^a-zA-Z0-9-]+/g, '') // Remove non-alphanumeric characters except hyphens
  //     .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
  //     .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  // }
}
