import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NotificationAskComponent } from './notification-ask/notification-ask.component';
import { ChatboatComponent } from './chatboat/chatboat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotificationAskComponent,
    ChatboatComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const navbarCollapse = document.querySelector(
          '.navbar-collapse',
        ) as HTMLElement;

        if (navbarCollapse) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import {
//   NavigationEnd,
//   NavigationStart,
//   NavigationCancel,
//   NavigationError,
//   Router,
//   RouterOutlet,
// } from '@angular/router';

// import { HeaderComponent } from './header/header.component';
// import { FooterComponent } from './footer/footer.component';
// import { NotificationAskComponent } from './notification-ask/notification-ask.component';
// import { ChatboatComponent } from './chatboat/chatboat.component';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterOutlet,
//     HeaderComponent,
//     FooterComponent,
//     NotificationAskComponent,
//     ChatboatComponent,
//   ],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css',
// })
// export class AppComponent implements OnInit {
//   loading = false;

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationStart) {
//         this.loading = true;
//       }

//       if (
//         event instanceof NavigationEnd ||
//         event instanceof NavigationCancel ||
//         event instanceof NavigationError
//       ) {
//         const navbarCollapse = document.querySelector(
//           '.navbar-collapse',
//         ) as HTMLElement;

//         if (navbarCollapse) {
//           navbarCollapse.classList.remove('show');
//         }

//         // Fast hide loader
//         setTimeout(() => {
//           this.loading = false;
//         }, 500);
//       }
//     });
//   }
// }
