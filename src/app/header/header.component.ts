import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

declare var gtag: any; // Declare gtag for Google Analytics 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  // Method to track Apply Now button clicks
  onClickEvent(eventName: string): void {
    // console.log('Event Triggered:', eventName);
    // console.log('Placeholder:', 'Apply now button header');

    // Example: Google Analytics (gtag)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'CTA Click',
        event_label: 'Header Apply Now',
        placeholder: 'Apply now button header',
        value: 1
      });
    }

    // Example: DataLayer (for GTM)
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        placeholder: 'Apply now button header',
        eventCategory: 'CTA Click',
        eventAction: 'Apply Now Click',
        eventLabel: 'Header'
      });
    }
  }

  
}
