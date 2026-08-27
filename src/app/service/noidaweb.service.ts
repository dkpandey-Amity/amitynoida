import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://amity.edu/amitywebapi/api';

  //private apiUrl = 'https://webapi.amity.edu/amitywebapi/api';

  //private noidakey = 'E4BC3C97-D903-48BD-9E0C-9F82AB0AD39F';

  private readonly BASE = 'https://chat-api.amity.edu/api';
  private readonly HISTORY_BASE = 'https://portal.amity.edu/chatbot';

  private metaUrl = 'https://noida.amity.edu';

  constructor(private http: HttpClient) {}

  amityLogin(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Amityapi/login1`, {
      Username: 'amity@!noida',
      Password: 'amity#@!noida',
    });
  }

  getLastDateToApply(): Observable<any> {
    const url = `${this.apiUrl}/amityapi/GetLastDatetoApply`;
    return this.http.get<any>(url);
  }

  getNewDistinguishedFacultyList(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/amityapi/GetNewDistinguishedFacultyList`,
    );
  }

  getNewFacultyList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/amityapi/GetNewFacultyList`);
  }

  getFacultyDetails(FacultySlug: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/amityapi/GetNewFacultyListbySlug?slugname=${FacultySlug}`,
    );
  }

  getAllUgDiscipline(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Amityapi/GetDiscipline?stype=g`);
  }

  getUgDisciplineProgramList(Disciplineslugname: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/NewGetAllProgramDisciplineListbasedonslug?sCampusName=noida&stype=g&disciplineSlug=${Disciplineslugname}`,
    );
  }

  getPgDisciplineProgramList(Disciplineslugname: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/NewGetAllProgramDisciplineListbasedonslug?sCampusName=noida&stype=pg&disciplineSlug=${Disciplineslugname}`,
    );
  }

  GetAllCourseCampus(): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/Amityapi/GetallCoursebasedonCampus`,
    );
  }

  GetAllGetFeePage(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Amityapi/GetFeePage`);
  }

  GetAllCoursewithoutDiscipline(): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/Amityapi/Getallcoursewithoutdiscipline?sCampusName=noida&stype=g`,
    );
  }
  GetAllPgCoursewithoutDiscipline(): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/Amityapi/Getallcoursewithoutdiscipline?sCampusName=noida&stype=pg`,
    );
  }

  GetPhdCourseWithoutDeiscipline(): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/Amityapi/GetallPhdCourseWithoutDeiscipline`,
    );
  }

  getIndustryUgPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=G&Category=industry`,
    );
  }

  GetUG3ContinentPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=G&Category=3continent`,
    );
  }

  GetUGInternationalPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=G&Category=InternationalPrograms`,
    );
  }

  getIntegratedUgPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/program/GetAllProgramsexceptugandPg?stype=G&Category=integrated`,
    );
  }

  getUGEveningPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=G&Category=EveningPrograms`,
    );
  }

  getIndustryPGPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=pg&Category=industry`,
    );
  }

  getAllUgIndustryProgramsDetails(SlugName: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllProgramDetailsBasedonSlug?sCampusName=noida&stype=g&Category=${SlugName}`,
    );
  }

  getAllPgIndustryProgramsDetails(SlugName: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllProgramDetailsBasedonSlug?sCampusName=noida&stype=pg&Category=${SlugName}`,
    );
  }

  // getAllUgProgramsDetails(
  //   disciplineSlug: string,
  //   programSlug: string,
  // ): Observable<any> {
  //   return this.http.get<any>(
  //     `${this.apiUrl}/Amityapi/NewGetAllProgramDisciplineListbasedonslug` +
  //       `?sCampusName=noida` +
  //       `&DisciplineSlug=${disciplineSlug}` +
  //       `&stype=g` + // 👈 UG = g
  //       `&programslug=${programSlug}` +
  //       ``,
  //   );
  // }

  getAllUgProgramsDetails(
    disciplineSlug: string,
    programSlug: string,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/NewGetAllProgramDisciplineListbasedonslug` +
        `?sCampusName=noida` +
        `&stype=g` +
        `&disciplineSlug=${encodeURIComponent(disciplineSlug)}` +
        `&categorySlug=${encodeURIComponent(programSlug)}`,
    );
  }

  // getAllPGProgramsDetails(
  //   disciplineSlug: string,
  //   programSlug: string,
  // ): Observable<any> {
  //   return this.http.get<any>(
  //     `${this.apiUrl}/Amityapi/NewGetAllProgramDisciplineListbasedonslug` +
  //       `?sCampusName=noida` +
  //       `&DisciplineSlug=${disciplineSlug}` +
  //       `&stype=pg` +
  //       `&programslug=${programSlug}` +
  //       ``,
  //   );
  // }

  getAllPGProgramsDetails(
    disciplineSlug: string,
    programSlug: string,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/NewGetAllProgramDisciplineListbasedonslug` +
        `?sCampusName=noida` +
        `&stype=pg` +
        `&disciplineSlug=${encodeURIComponent(disciplineSlug)}` +
        `&categorySlug=${encodeURIComponent(programSlug)}`,
    );
  }

  getPG3ContinentPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=pg&Category=3continent`,
    );
  }

  getPGInternationalPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=pg&Category=InternationalPrograms`,
    );
  }

  getIntegratedPgPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=pg&Category=integrated`,
    );
  }

  getPGEveningPrograms(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Program/GetAllProgramsexceptugandPg?stype=pg&Category=EveningPrograms`,
    );
  }

  getAllPgDiscipline(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Amityapi/GetDiscipline?stype=pg`);
  }

  getEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Events/GetEvents`);
  }

  getAllEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Events/GetEvents`);
  }

  getHomePageEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Events/GetTop3Events`);
  }

  getEventDetails(SlugName: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Events/GetEventsBySlug?SlugName=${SlugName}`,
    );
  }

  postEnquiryForm(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Amityapi/SubmitEnquiryForm`,
      formData,
    );
  }

  getAllUgProgramDetailsSemester(ProgramCode: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllProgramDetailsSemester?ProgramCode=${ProgramCode}`,
    );
  }

  getAllPgProgramDetailsSemester(ProgramCode: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllProgramDetailsSemester?ProgramCode=${ProgramCode}`,
    );
  }

  getTestimonials(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetTestimonials?Category=students`,
    );
  }

  getParentsTestimonials(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetTestimonials?Category=Parents`,
    );
  }

  getAlumniTestimonials(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetTestimonials?Category=Alumni`,
    );
  }

  getHomeAlumniTestimonials(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetTop3Testimonials?Category=Alumni`,
    );
  }

  submitTechnicalProblemform(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Amityapi/SubmitTechnicalProblemForNoida`,
      formData,
    );
  }

  getAllBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Amityapi/GetNews`);
  }

  getBlogDetails(Id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Amityapi/GetNewsDetail?Id=${Id}`);
  }

  getAllProgramMetas(SlugName: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllProgramKeywords?Category=${SlugName}`,
    );
  }

  getHomePageMetas(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=https://noida.amity.edu/`,
    );
  }

  getAboutUniversitymeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/about-university`,
    );
  }

  getProgramBrochureMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/program-brochures`,
    );
  }

  getAcademiaMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/academia`,
    );
  }

  getAcademicMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/academic`,
    );
  }

  getAccreditationsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/accreditations`,
    );
  }

  getAllprogramsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/all-programs`,
    );
  }

  getBehavioralScienceMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/behavioral-science`,
    );
  }

  getBeyondAcademicsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/beyond-academics`,
    );
  }

  getNewsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/news`,
    );
  }

  getcampusEventsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/campus-events`,
    );
  }

  getCampusLifeMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/campus-life`,
    );
  }

  getcampusSecurityMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/campus-security`,
    );
  }

  getCareerResourceCentreMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/career-resource-centre`,
    );
  }

  getCareertestMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/career-test`,
    );
  }

  getCaseStudiesMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/case-studies`,
    );
  }

  getconferencesMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/conferences`,
    );
  }

  getcontactusMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/contact-us`,
    );
  }

  getcorporatePartnersMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/corporate-partners`,
    );
  }

  getdiversityMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/diversity`,
    );
  }

  getEducationLoanMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/education-loan`,
    );
  }

  getEventsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/events`,
    );
  }

  getFacultyMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/faculty`,
    );
  }

  getfaqMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/faq`,
    );
  }

  getNepMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/nep`,
    );
  }

  getflexibleCreditSystemMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/flexible-credit-system`,
    );
  }

  getforeignLanguageMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/foreign-language`,
    );
  }

  getGuestLecturesMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/guest-lectures`,
    );
  }

  getHigherEducationMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/higher-education`,
    );
  }

  getHowToApplyMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/how-to-apply`,
    );
  }

  getincubatorMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/incubator`,
    );
  }

  getIndustryInteractonMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/industry-interacton`,
    );
  }

  getInfrastructureMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/infrastructure`,
    );
  }

  getInternationalStudentsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/international-students`,
    );
  }

  getLeadershipPageKeywords(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/leadership`,
    );
  }

  getMediaCoverageMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/media-coverage`,
    );
  }

  getmentoringSystemMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/mentoring-system`,
    );
  }

  getNonAcademicMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/non-academic`,
    );
  }

  getAmitylogoMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/amity-university-logo`,
    );
  }

  getpatentsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/patents`,
    );
  }

  getPlacementStatisticsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/placement-statistics`,
    );
  }

  getPlacementsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/placements`,
    );
  }

  getPostgraduateProgramsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/postgraduate-programs`,
    );
  }

  getPrivacyPolicyMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/privacy-policy`,
    );
  }

  getGraduateProgramsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/graduate-programs`,
    );
  }

  getPublicationsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/publications`,
    );
  }

  getQualityMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/quality`,
    );
  }

  getRankingsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/rankings`,
    );
  }

  getResearchCentresMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/research-centres`,
    );
  }

  getSangathanMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/sangathan`,
    );
  }

  getScholarshipsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/scholarships`,
    );
  }

  getSitemapMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/sitemap`,
    );
  }

  getSocialInitiativesMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/social-initiatives`,
    );
  }

  getSponsoredProjectsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/sponsored-projects`,
    );
  }

  getStudentClubsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/student-clubs`,
    );
  }

  getAcaiNewSelectedInnovationsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/selected-publications`,
    );
  }

  getAcaiStudentInnovationMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/student-innovation`,
    );
  }

  getStudentLifeMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/student-life`,
    );
  }

  getStudentResearchMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/student-research`,
    );
  }

  getStudyAbroadProgramMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/study-abroad-program`,
    );
  }

  getTestimonialsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/testimonials`,
    );
  }

  getTieupsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/tie-ups`,
    );
  }

  getUniversityFestMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/university-fest`,
    );
  }

  getVisionMissionMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/vision-mission`,
    );
  }

  getWithdrawalMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/withdrawal`,
    );
  }

  getWorkAmityMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/careers-at-amity`,
    );
  }

  // get404PageMeta() {
  //   return this.http.get<any>(
  //     `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/404`,
  //   );
  // }

  getWorkIntegratedProgramsMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/work-integrated-programs`,
    );
  }

  getFeeStructureMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/fee-structure`,
    );
  }

  getGlobalCampusesMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/global-campuses`,
    );
  }

  getUgMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/ug`,
    );
  }

  getPgMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/pg`,
    );
  }

  getPhdMeta(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPageKeywords?url=${this.metaUrl}/phd`,
    );
  }
  getPhdDisciplineList(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAllPHDDisciplineList`,
    );
  }

  // getAllPhdCourseBasedonDiscipline(sDiscipline: any): Observable<any> {
  //   return this.http.get<any>(
  //     `${this.apiUrl}/Amityapi/GetallPhdCoursebasedondisciplineslug?Category=${sDiscipline}`,
  //   );
  // }

  getAllPhdCourseBasedonDiscipline(disciplineSlug: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/NewGetallPhdCoursebasedondisciplineslug`,
      {
        params: {
          sCampusName: 'noida',
          stype: 'pg',
          disciplineSlug: disciplineSlug,
        },
      },
    );
  }

  // GetPhdCourseDetails(SlugName: any): Observable<any> {
  //   return this.http.get<any>(
  //     `${this.apiUrl}/Amityapi/GetallPhdCourseDetails?slugname=${SlugName}`,
  //   );
  // }

  GetPhdCourseDetails(
    disciplineSlug: string,
    categorySlug: string,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/NewGetallPhdCoursebasedondisciplineslug` +
        `?sCampusName=noida` +
        `&stype=pg` +
        `&disciplineSlug=${disciplineSlug}` +
        `&categorySlug=${categorySlug}` +
        ``,
    );
  }

  GetUgEnquiryformCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/Amityapi/GetEnquiryformCourses?sCampusName=noida&stype=g`,
    );
  }
  GetPgEnquiryformCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/Amityapi/GetEnquiryformCourses?sCampusName=noida&stype=pg`,
    );
  }

  GetCountryCode(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/Amityapi/GetCountryCode`);
  }

  getallPublication(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/amityapi/GetNoidaPublication`);
  }

  GetAllBrouchre(): Observable<Course[]> {
    return this.http.get<any>(`${this.apiUrl}/Amityapi/GetBrouchre`);
  }

  GetAcaiselectedpublications(): Observable<any> {
    return this.http.get<any>(`https://amity.edu/amitywebapi/api/Institute/GetAcaiNewInnovations`);
  }

  GetAcaiStudentInnovation(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetAcaiStudentInnovation`,
    );
  }

  getAllFaq(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Amityapi/GetWebsiteFaq`);
  }

  getOldUrlRewrite(oldUrl: string): Observable<any> {
    const cleanUrl = oldUrl.trim().replace(/\/$/, '');
    return this.http.get<any>(
      `${this.apiUrl}/Amityapi/GetOldUrlRewrite?OldUrl=${encodeURIComponent(cleanUrl)}`,
    );
  }

  allCourseSubmitEnquiryForm(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Amityapi/SubmitCourseEnquiryForm`,
      formData,
    );
  }

  getVirtualSession(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Amityapi/GetVirtualSession`);
  }

  private jsonHeaders(token?: string) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /* ---------------- AUTH ---------------- */
  login(payload: any): Observable<any> {
    return this.http.post(`${this.BASE}/auth/login`, {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.replace(/\D/g, ''),
      country_code: payload.country_code.replace('+', ''),
    });
  }

  verifyOtp(payload: any): Observable<any> {
    return this.http.post(`${this.BASE}/otp/verify`, {
      phone: payload.phone.replace(/\D/g, ''),
      email: payload.email.trim().toLowerCase(),
      otp: payload.otp.trim(),
    });
  }

  resendOtp(payload: any): Observable<any> {
    return this.http.post(`${this.BASE}/otp/resend`, {
      phone: payload.phone.replace(/\D/g, ''),
      email: payload.email.trim().toLowerCase(),
    });
  }

  /* ---------------- CHAT ---------------- */
  sendMessage(payload: any): Observable<any> {
    if (!payload.session_id || !payload.user_id) return EMPTY;

    return this.http.post(`${this.BASE}/chat/message`, {
      content: payload.content.trim(),
      session_id: payload.session_id,
      user_id: payload.user_id,
      campus: payload.campus ?? 'noida',
      email: payload.email?.trim().toLowerCase(),
    });
  }

  getWelcomeMessage(): Observable<any> {
    return this.http.get(`${this.BASE}/chat/welcome-message`);
  }

  /* ---------------- GET CHAT AUTH TOKEN ---------------- */
  getChatAuthToken(payload: { mobile: string; otp: string }) {
    return this.http.post<{
      data: { token: string; sessionId: string; userId: string };
    }>(`${this.HISTORY_BASE}/api/chat/get-auth-token`, {
      mobile: payload.mobile.replace(/\D/g, ''),
      otp: payload.otp.trim(),
    });
  }

  saveChatHistory(
    message: string,
    isBot: boolean,
    accessToken: string | null,
  ): Observable<any> {
    if (!accessToken || !message?.trim()) return EMPTY;

    return this.http.post(
      `${this.HISTORY_BASE}/api/chat/save-history`,
      {
        message: message.trim(),
        isBot: isBot,
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        }),
      },
    );
  }

  getSessionHistory(sessionId: string, accessToken: string): Observable<any> {
    return this.http.get(`${this.BASE}/chat/history/${sessionId}`, {
      headers: this.jsonHeaders(accessToken),
    });
  }
}
