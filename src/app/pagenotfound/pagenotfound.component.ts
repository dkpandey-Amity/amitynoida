import { Component } from '@angular/core';

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.css'
})
export class PagenotfoundComponent {

}



// import { Component, OnInit } from '@angular/core';
// import { Meta, Title } from '@angular/platform-browser';
// import { ApiService } from '../service/noidaweb.service';

// @Component({
//   selector: 'app-pagenotfound',
//   standalone: true,
//   imports: [],
//   templateUrl: './pagenotfound.component.html',
//   styleUrl: './pagenotfound.component.css'
// })
// export class PagenotfoundComponent implements OnInit {

//   constructor(
//     private meta: Meta,
//     private titleService: Title,
//     private apiService: ApiService
//   ) {}

//   ngOnInit(): void {
//     this.updateMetaTags();
//   }

//   updateMetaTags(): void {
//     this.apiService.get404PageMeta().subscribe({
//       next: (data: any[]) => {

//         const metaData = data?.[0];

//         this.titleService.setTitle(
//           metaData?.Title || '404 - Page Not Found'
//         );

//         this.meta.updateTag({
//           name: 'description',
//           content: metaData?.Description || 'Page not found'
//         });

//         this.meta.updateTag({
//           name: 'keywords',
//           content: metaData?.Keywords || '404,page not found'
//         });

//         this.meta.updateTag({
//           name: 'robots',
//           content: 'noindex,nofollow'
//         });

//         const canonicalUrl =
//           metaData?.CanonicalUrl || window.location.href;

//         this.setCanonicalLink(canonicalUrl);

//         // Open Graph
//         this.meta.updateTag({
//           property: 'og:title',
//           content: metaData?.Title || '404 - Page Not Found'
//         });

//         this.meta.updateTag({
//           property: 'og:description',
//           content: metaData?.Description || 'Page not found'
//         });

//         this.meta.updateTag({
//           property: 'og:url',
//           content: canonicalUrl
//         });

//         // Twitter
//         this.meta.updateTag({
//           name: 'twitter:title',
//           content: metaData?.Title || '404 - Page Not Found'
//         });

//         this.meta.updateTag({
//           name: 'twitter:description',
//           content: metaData?.Description || 'Page not found'
//         });
//       },
//       error: () => {
//         this.titleService.setTitle('404 - Page Not Found');
//       }
//     });
//   }

//   private setCanonicalLink(url: string): void {
//     let link: HTMLLinkElement | null =
//       document.querySelector('link[rel="canonical"]');

//     if (!link) {
//       link = document.createElement('link');
//       link.setAttribute('rel', 'canonical');
//       document.head.appendChild(link);
//     }

//     link.setAttribute('href', url);
//   }
// }