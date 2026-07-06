// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter, withInMemoryScrolling } from '@angular/router';
// import { routes } from './app.routes';
// import {
//   provideHttpClient,
//   withInterceptors
// } from '@angular/common/http';
// import { provideToastr } from 'ngx-toastr';
// import { authInterceptor } from './service/auth.interceptor';

// // export const appConfig: ApplicationConfig = {
// //   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
// // };

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(
//       withInterceptors([authInterceptor])
//     ),
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(
//       routes,
//       withInMemoryScrolling({
//         scrollPositionRestoration: 'enabled', // enable position restoration
//       })
//     ),
//     provideToastr({
//       timeOut: 3000,
//       positionClass: 'toast-top-right',
//       preventDuplicates: true,
//     }),
//   ],
// };

import {
  ApplicationConfig,
  APP_INITIALIZER,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideToastr } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './service/auth.interceptor';
import { ApiService } from './service/noidaweb.service';

export function initializeApp() {
  const apiService = inject(ApiService);

  return async () => {
    try {
      const res: any = await firstValueFrom(apiService.amityLogin());

      (window as any).accessToken = res.AccessToken;
      (window as any).refreshToken = res.RefreshToken;
    } catch (error) {
      console.error('Unable to load token', error);
    } finally {
      const loader = document.getElementById('startup-loader');

      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity .5s ease';

        setTimeout(() => {
          loader.remove();
        }, 500);
      }
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),

    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),

    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),

    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
    },
  ],
};
