// import { HttpInterceptorFn } from '@angular/common/http';
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   //console.log('REQUEST URL =>', req.url);

//   if (req.url.includes('login1')) {
//     return next(req);
//   }

//   const token = localStorage.getItem('accessToken');

//   //console.log('TOKEN =>', token);

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     //console.log('HEADER ADDED');
//   }

//   return next(req);
// };

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //const skipUrls = ['login1','https://portal.amity.edu/chatbot'];

  // const skipUrls = [
  //   'login1',
  //   'https://portal.amity.edu/chatbot',
  //   '/NewOnlineForm/',
  //   'portal.amity.edu/NewOnlineForm/',
  // ];

  const skipUrls = [
    'login1',
    '/NewOnlineForm/',
    'portal.amity.edu/NewOnlineForm/',
    'SubmitCourseEnquiryForm', // <-- Skip this API
    'https://amity.edu/amitywebapi/api/Amityapi/SubmitCourseEnquiryForm',
    'https://portal.amity.edu/chatbot',
  ];

  const token = (window as any)?.accessToken;

  if (!token || skipUrls.some((url) => req.url.includes(url))) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};

