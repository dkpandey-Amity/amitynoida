import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { CryptoPayloadService } from './crypto-payload.service';

export interface OtpResponse {
  success?: boolean;
  message?: string;
  loginNo?: string;
  alreadyExists?: boolean;
  formNo?: string;
  token?: string;
  caseType?: string;
  INTNL?: boolean;
}

export interface CountryCodeResponse {
  success: boolean;
  message: string;
  data: {
    CountryCode: string;
  }[];
}

const ACCESS_KEY = 'camadmsiteEsLrxhRxV8BkbYKMCH5BAw==';
const SECRET_KEY = 'camadmsiteIT1ty2E/ZP3D+nniosybWgty';

@Injectable({
  providedIn: 'root',
})
export class LandingserviceService {
  // private baseUrl = 'https://admstage.amizone.net/OnFormLive/OnlineForms';

  private baseUrl = 'https://portal.amity.edu/NewOnlineForm/OnlineForms';

  private sendOtpUrl = `${this.baseUrl}/CampaignAdmissionEduSite`;

  private verifyOtpUrl = `${this.baseUrl}/CampaignAdmissionVerifyMobile`;

  private bindCountryCodeUrl = `${this.baseUrl}/BindCountryCodes`;

  private headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  constructor(
    private http: HttpClient,
    private crypto: CryptoPayloadService,
  ) {}

  private encBody(payload: object): string {
    const encrypted = this.crypto.encrypt({
      accessKey: ACCESS_KEY,
      secretKey: SECRET_KEY,
      ...payload,
    });

    return 'data=' + encodeURIComponent(encrypted);
  }

  private dec<T>(): (source: Observable<{ d: string }>) => Observable<T> {
    return (source) =>
      source.pipe(
        map((res) => {
          if (res?.d) {
            return this.crypto.decrypt(res.d) as T;
          }
          return res as unknown as T;
        }),
      );
  }

  sendOtp(data: {
    firstName: string;
    email: string;
    countryCode: string;
    mobile: string;
    Coursecd?: string; // <-- Add this
    target?: 'mobile' | 'email';
    pageUrl?: string;
    campusId?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    utm_location?: string;
    state?: string;
    city?: string;
    sourceReferral?: string;
    sGCLID?: string;
    mx_Is_brochure_Leads?: string;
  }): Observable<OtpResponse> {
    return this.http
      .post<{ d: string }>(
        this.sendOtpUrl,
        this.encBody({
          pageUrl: window.location.href,

          // Default UTM values
          utm_source: 'Direct Traffic',
          utm_medium: 'Brochure',
          utm_campaign: 'Brochure',
          CampusId: '1',
          mx_Is_brochure_Leads: 'Yes',

          ...data, // Coursecd will automatically be included
        }),
        { headers: this.headers },
      )
      .pipe(this.dec<OtpResponse>());
  }

    enquirysendOtp(data: {
    firstName: string;
    email: string;
    countryCode: string;
    mobile: string;
    Coursecd?: string; // <-- Add this
    target?: 'mobile' | 'email';
    pageUrl?: string;
    campusId?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    utm_location?: string;
    state?: string;
    city?: string;
    sourceReferral?: string;
    sGCLID?: string;
    mx_Is_brochure_Leads?: string;
  }): Observable<OtpResponse> {
    return this.http
      .post<{ d: string }>(
        this.sendOtpUrl,
        this.encBody({
          pageUrl: window.location.href,

          // Default UTM values
          utm_source: 'Direct Traffic',
          utm_medium: 'Enquiry Form',
          utm_campaign: 'Enquiry Form',
          CampusId: '1',
          mx_Is_brochure_Leads: 'Yes',

          ...data, // Coursecd will automatically be included
        }),
        { headers: this.headers },
      )
      .pipe(this.dec<OtpResponse>());
  }

  verifyOtp(
    loginNo: string,
    otp: string,
    campusId?: string,
  ): Observable<OtpResponse> {
    return this.http
      .post<{ d: string }>(
        this.verifyOtpUrl,
        this.encBody({
          loginNo,
          otp,
          CampusId: '1',
          ...(campusId ? { campusId } : {}),
        }),
        { headers: this.headers },
      )
      .pipe(this.dec<OtpResponse>());
  }

  getCountryCodes(): Observable<CountryCodeResponse> {
    return this.http
      .post<{
        d: string;
      }>(this.bindCountryCodeUrl, this.encBody({}), { headers: this.headers })
      .pipe(this.dec<CountryCodeResponse>());
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { environment } from '../environments/environment';
// import { CryptoPayloadService } from './crypto-payload.service';

// export interface OtpResponse {
//   success?: boolean;
//   message?: string;
//   loginNo?: string;
//   alreadyExists?: boolean;
//   formNo?: string;
//   token?: string;
//   caseType?: string;
//   INTNL?: boolean;
// }

// export interface CountryCodeResponse {
//   success: boolean;
//   message: string;
//   data: {
//     CountryCode: string;
//   }[];
// }

// const ACCESS_KEY = 'camadmsiteEsLrxhRxV8BkbYKMCH5BAw==';
// const SECRET_KEY = 'camadmsiteIT1ty2E/ZP3D+nniosybWgty';

// @Injectable({
//   providedIn: 'root',
// })
// export class LandingserviceService {
//   // private baseUrl = 'https://admstage.amizone.net/OnFormLive/OnlineForms';

//  private baseUrl = 'https://portal.amity.edu/NewOnlineForm/OnlineForms';

//   private sendOtpUrl = `${this.baseUrl}/CampaignAdmissionEduSite`;

//   private verifyOtpUrl = `${this.baseUrl}/CampaignAdmissionVerifyMobile`;

//   private bindCountryCodeUrl = `${this.baseUrl}/BindCountryCodes`;

//   private headers = new HttpHeaders({
//     'Content-Type': 'application/x-www-form-urlencoded',
//   });

//   constructor(
//     private http: HttpClient,
//     private crypto: CryptoPayloadService,
//   ) {}

//   private encBody(payload: object): string {
//     const encrypted = this.crypto.encrypt({
//       accessKey: ACCESS_KEY,
//       secretKey: SECRET_KEY,
//       ...payload,
//     });

//     return 'data=' + encodeURIComponent(encrypted);
//   }

//   private dec<T>(): (source: Observable<{ d: string }>) => Observable<T> {
//     return (source) =>
//       source.pipe(
//         map((res) => {
//           if (res?.d) {
//             return this.crypto.decrypt(res.d) as T;
//           }
//           return res as unknown as T;
//         }),
//       );
//   }

//   sendOtp(data: {
//     firstName: string;
//     email: string;
//     countryCode: string;
//     mobile: string;
//     target?: 'mobile' | 'email';
//     pageUrl?: string;
//     campusId?: string;
//     utm_source?: string;
//     utm_medium?: string;
//     utm_campaign?: string;
//     utm_content?: string;
//     utm_term?: string;
//     utm_location?: string;
//     state?: string;
//     city?: string;
//     sourceReferral?: string;
//     sGCLID?: string;
//   }): Observable<OtpResponse> {
//     return this.http
//       .post<{ d: string }>(
//         this.sendOtpUrl,
//         this.encBody({
//           pageUrl: window.location.href,

//           // Default UTM values
//           utm_source: 'Brochure',
//           utm_medium: 'Brochure',
//           utm_campaign: 'Brochure',

//           ...data,
//         }),
//         { headers: this.headers },
//       )
//       .pipe(this.dec<OtpResponse>());
//   }

//   verifyOtp(
//     loginNo: string,
//     otp: string,
//     campusId?: string,
//   ): Observable<OtpResponse> {
//     return this.http
//       .post<{ d: string }>(
//         this.verifyOtpUrl,
//         this.encBody({
//           loginNo,
//           otp,
//           ...(campusId ? { campusId } : {}),
//         }),
//         { headers: this.headers },
//       )
//       .pipe(this.dec<OtpResponse>());
//   }

//   // getCountryCodes(): Observable<CountryCodeResponse> {
//   //   return this.http
//   //     .post<{
//   //       d: string;
//   //     }>(this.bindCountryCodeUrl, this.encBody({}), { headers: this.headers })
//   //     .pipe(this.dec<CountryCodeResponse>());
//   // }

//   getCountryCodes(): Observable<CountryCodeResponse> {
//     const body = this.encBody({});
//     console.log('BODY SENT:', body);

//     return this.http
//       .post<{ d: string }>(
//         this.bindCountryCodeUrl,
//         body,
//         { headers: this.headers }
//       )
//       .pipe(
//         map(res => {
//           console.log('RAW RESPONSE:', res);  // ← What server actually returns
//           return res;
//         }),
//         this.dec<CountryCodeResponse>(),
//         map(res => {
//           console.log('DECRYPTED RESPONSE:', res);  // ← After decryption
//           return res;
//         })
//       );
// }
// }
