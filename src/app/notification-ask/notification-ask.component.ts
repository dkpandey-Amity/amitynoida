// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-notification-ask',
//   standalone: true,
//   imports: [],
//   templateUrl: './notification-ask.component.html',
//   styleUrl: './notification-ask.component.css'
// })
// export class NotificationAskComponent {

// }

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    Moengage: any;
  }
}

@Component({
  selector: 'app-notification-ask',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Custom Notification Ask Component -->
      <div class="custom-notification-ask" [ngStyle]="containerStyles">
        <div [ngStyle]="notificationStyles">
          <!-- Main text -->
          <div [ngStyle]="textStyles">
            Tap
            <span [ngStyle]="highlightStyles">ALLOW</span>
            to get real-time updates.
          </div>
          
          <!-- Buttons -->
          <div [ngStyle]="buttonContainerStyles">
            <button 
              class="block-notifications-btn"
              [ngStyle]="blockButtonStyles"
              (mouseenter)="onBlockButtonHover($event)"
              (mouseleave)="onBlockButtonLeave($event)">
              I'll do this later
            </button>
            
            <button 
              class="allow-notifications-btn"
              [ngStyle]="allowButtonStyles"
              (mouseenter)="onAllowButtonHover($event)"
              (mouseleave)="onAllowButtonLeave($event)">
              Allow
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./notification-ask.component.css']
})
export class NotificationAskComponent implements OnInit, OnDestroy {
  private timeoutId: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    
    console.log('🔔 Notification component initialized');
    
    // Wait for MoEngage to be available, then call web push
    this.timeoutId = setTimeout(() => {
      if (window.Moengage && window.Moengage.call_web_push) {
        window.Moengage.call_web_push({
          "soft_ask": true,
          "main_class": "custom-notification-ask",
          "allow_class": "allow-notifications-btn",  
          "block_class": "block-notifications-btn"
        });
        console.log("✅ MoEngage self-handled opt-in initiated");
      } else {
        console.error("❌ MoEngage call_web_push not available");
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    console.log('🔔 Notification component destroyed');
  }

  // 🎨 Component Styles
  containerStyles = {
    'display': 'none',
    'pointer-events': 'none'
  };

  notificationStyles = {
    'position': 'fixed',
    'bottom': '20px',
    'left': '10px',
    'background-color': '#152d4a',
    'border-radius': '15px',
    'padding': '15px',
    'max-width': '350px',
    'z-index': '9999',
    'color': 'white',
    'font-family': '"Maven Pro", sans-serif',
    'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(0, 0, 0, 0.2)',
    'border': '1px solid white',
    'pointer-events': 'auto',
    'animation': 'slideUp 0.4s ease-out'
  };

  textStyles = {
    'font-size': '12px',
    'font-weight': '500',
    'margin-bottom': '20px',
    'line-height': '1.4',
    'font-family': '"Maven Pro", sans-serif;'
  };

  highlightStyles = {
    'background': '#fbbf24',
    'color': '#1e3a8a',
    'padding': '4px 12px',
    'border-radius': '8px',
    'font-size': '10px',
    'font-weight': 'bold',
    'display': 'inline-block'
  };

  buttonContainerStyles = {
    'display': 'flex',
    'gap': '12px'
  };

blockButtonStyles = {
  'flex': '0 0 auto',
  'padding': '2px 8px',
  'border': 'none',
  'border-radius': '12px',
  'background': '#00007b',
  'color': 'white',
  'font-size': '12px',
  'cursor': 'pointer',
  'transition': 'all 0.2s ease',
  'pointer-events': 'auto'
};

allowButtonStyles = {
  'flex': '1',
  'padding': '2px 8px',
  'border': '2px solid white',
  'border-radius': '12px',
  'background': 'transparent',
  'color': 'white',
  'font-size': '12px',
  'cursor': 'pointer',
  'transition': 'all 0.2s ease',
  'pointer-events': 'auto'
};



    // 🎯 Event handlers
  onBlockButtonHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    target.style.background = '#4338ca';
    target.style.transform = 'translateY(-2px)';
    target.style.boxShadow = '0 8px 20px rgba(67, 56, 202, 0.4)';
  }

  onBlockButtonLeave(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    target.style.background = '#00007b';
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = 'none';
  }

  onAllowButtonHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    target.style.background = 'rgba(255, 255, 255, 0.1)';
    target.style.borderColor = '#fbbf24';
    target.style.color = '#fbbf24';
  }

  onAllowButtonLeave(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    target.style.background = 'transparent';
    target.style.borderColor = 'white';
    target.style.color = 'white';
  }
}

