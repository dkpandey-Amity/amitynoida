import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { ApiService } from '../service/noidaweb.service';

interface ChatMessage {
  text: string;
  type: 'sent' | 'received' | 'welcome';
}

@Component({
  selector: 'app-chatboat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './chatboat.component.html',
  styleUrl: './chatboat.component.css',
})
export class ChatboatComponent implements OnDestroy {
  isOpen = false;
  isMinimizing = false;
  isTyping = false;
  step: 'WELCOME' | 'LOGIN' | 'OTP' | 'CHAT' = 'WELCOME';

  name = '';
  email = '';
  countryCode = '+91';
  phone = '';
  otp = '';

  sessionId: string = '';
  userId: string | null = null;

  userMessage = '';
  messages: ChatMessage[] = [];

  activeSessions: any[] = [];

  accessToken: string | null = null;

  @ViewChild('chatMessages', { static: false })
  chatMessages!: ElementRef<HTMLDivElement>;

  resendCountdown = 60;
  resendDisabled = true;
  private resendTimer?: number;

  otpError = '';
  private shouldAutoScroll = true;

  constructor(private chatApi: ApiService) {
    this.sessionId = sessionStorage.getItem('chat_session_id') || '';
    this.userId = sessionStorage.getItem('chat_user_id');
    this.accessToken = sessionStorage.getItem('chat_access_token');
    this.email = sessionStorage.getItem('chat_access_email') || '';

    if (this.accessToken) {
      this.step = 'CHAT';
      this.loadSessionHistory();
    }
  }

  /* ---------------- MARKDOWN FORMATTER ---------------- */
  formatMessage(text: string): string {
    if (!text) return '';
    return marked.parse(text, { async: false }) as string;
  }

  /* ---------------- CHAT TOGGLE ---------------- */
  toggleChat() {
    this.isOpen = true;

    if (!this.accessToken) {
      this.step = 'WELCOME';
    }
  }

  startNewConversation() {
    this.step = 'LOGIN';
  }

  closeChat() {
    this.isMinimizing = true;

    setTimeout(() => {
      this.isOpen = false;
      this.isMinimizing = false;
    }, 100);
  }

  onUserScroll() {
    const el = this.chatMessages.nativeElement;
    const threshold = 60; // px from bottom
    this.shouldAutoScroll =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  }

  /* ---------------- LOGIN ---------------- */
  continueLogin(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    sessionStorage.setItem('chat_access_email', this.email);

    this.chatApi
      .login({
        name: this.name,
        email: this.email,
        phone: this.phone,
        country_code: this.countryCode,
      })
      .subscribe((res) => {
        this.step = 'OTP';
        this.startResendTimer();
      });
  }

  startResendTimer() {
    this.resendDisabled = true;
    this.resendCountdown = 60;

    if (this.resendTimer) clearInterval(this.resendTimer);

    this.resendTimer = window.setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.resendDisabled = false;
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }

  allowNumbersOnly(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  verifyOtp(form: any) {
    this.otpError = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.chatApi
      .verifyOtp({ phone: this.phone, email: this.email, otp: this.otp })
      .subscribe({
        next: () => {
          this.chatApi
            .getChatAuthToken({ mobile: this.phone, otp: this.otp })
            .subscribe({
              next: (res) => {
                const data = res?.data;
                if (!data) {
                  this.otpError = 'Failed to get chat token';
                  return;
                }
                this.accessToken = data.token;
                sessionStorage.setItem('chat_access_token', data.token);
                sessionStorage.setItem('chat_session_id', data.sessionId);
                sessionStorage.setItem('chat_user_id', data.userId);

                this.accessToken = data.token;
                this.sessionId = data.sessionId;
                this.userId = data.userId;
                this.step = 'CHAT';
                this.fetchWelcomeMessage();
              },
            });
        },
      });
  }

  /* ---------------- SESSION HISTORY ---------------- */
  loadSessionHistory() {
    this.fetchWelcomeMessage();

    if (!this.sessionId || !this.accessToken) return;

    this.chatApi
      .getSessionHistory(this.sessionId, this.accessToken!)
      .subscribe((res: any) => {
        const history = res?.messages || [];
        this.messages = history.map((item: any) => ({
          text: item.content || '',
          type: item.role === 'assistant' ? 'received' : 'sent',
          time: this.getTime(item.timestamp),
        }));

        // ✅ SHOW WELCOME ONLY IF NO HISTORY
        if (this.messages.length === 0) {
          this.fetchWelcomeMessage();
        }

        this.scrollToBottom();
      });
  }

  resendOtp() {
    if (this.resendDisabled) return;
    this.chatApi
      .resendOtp({ phone: this.phone, email: this.email })
      .subscribe(() => this.startResendTimer());
  }

  changeMobileNumber() {
    // Clear OTP related state
    this.otp = '';
    this.otpError = '';

    // Stop resend timer
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = undefined;
    }

    // Go back to LOGIN step
    this.step = 'LOGIN';

    // 🔒 Keep name, email, country code as-is
    // ✏️ Allow phone number to be changed
  }

  restartChat() {
    this.isTyping = false;

    // clear chat
    this.messages = [];
    this.userMessage = '';

    // new session
    this.sessionId = 'session_' + Date.now();
    sessionStorage.setItem('chat_session_id', this.sessionId);

    // stay in chat
    this.step = 'CHAT';

    // 🔥 SHOW WELCOME MESSAGE ON RESET
    this.fetchWelcomeMessage();

    this.isOpen = false;
    setTimeout(() => {
      this.isOpen = true;
      this.forceScrollToBottom();
    }, 150);
  }

  /* ---------------- CHAT ---------------- */

  private fetchWelcomeMessage() {
    if (this.messages.some((m) => m.type === 'welcome')) return;

    this.chatApi.getWelcomeMessage().subscribe({
      next: (res: any) => {
        const text =
          typeof res?.welcome_message === 'string'
            ? res.welcome_message
            : 'Welcome! How can I help you today?';

        this.messages.push({
          text: text.replace(/\n+/g, '<br>'),
          type: 'welcome',
        });

        this.scrollToBottom();
      },
    });
  }

  private forceScrollToBottom() {
    if (!this.chatMessages) return;

    setTimeout(() => {
      this.chatMessages.nativeElement.scrollTo({
        top: this.chatMessages.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }

  private handleSessionExpired() {
    // Clear storage
    sessionStorage.removeItem('chat_access_token');
    sessionStorage.removeItem('chat_session_id');
    sessionStorage.removeItem('chat_user_id');
    sessionStorage.removeItem('chat_access_email');
    sessionStorage.removeItem('chat_login_time');

    // Reset variables
    this.accessToken = null;
    this.sessionId = '';
    this.userId = null;

    this.messages = [];
    this.userMessage = '';
    this.isTyping = false;

    // Close and reopen chat cleanly
    this.isOpen = false;

    setTimeout(() => {
      this.step = 'LOGIN';
      this.isOpen = true;
    }, 100);
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    const msg = this.userMessage.trim();
    this.userMessage = '';

    this.messages.push({
      text: msg,
      type: 'sent',
    });

    // 🔥 FORCE scroll for user message
    this.forceScrollToBottom();

    this.isTyping = true;


    // this.chatApi.saveChatHistory(msg, false, this.accessToken).subscribe({
    //   error: (err) => {
    //     if (err.status === 401) {
    //       this.handleSessionExpired();
    //       return;
    //     }
    //   },
    // });



    const payLoad = {
      content: msg,
      session_id: this.sessionId,
      user_id: this.userId,
      campus: 'noida',
      email: this.email,
    };

    this.chatApi.sendMessage(payLoad).subscribe({
      next: (res: any) => {
        this.isTyping = false;

        const botReply = res?.content ?? 'Sorry, I did not understand that.';
        this.messages.push({
          text: botReply,
          type: 'received',
        });

        // 🔥 FORCE scroll for bot reply
        this.forceScrollToBottom();


        this.chatApi
          .saveChatHistory(botReply, true, this.accessToken)
          .subscribe({
            error: (err) => {
              if (err.status === 401) {
                this.handleSessionExpired();
                return;
              }
            },
          });


      },
      error: () => {
        this.isTyping = false;
        this.messages.push({
          text: 'Sorry, something went wrong.',
          type: 'received',
        });
        this.forceScrollToBottom();
      },
    });
  }

  private scrollToBottom() {
    if (!this.chatMessages || !this.shouldAutoScroll) return;

    setTimeout(() => {
      this.chatMessages.nativeElement.scrollTo({
        top: this.chatMessages.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }

  ngOnDestroy() {
    if (this.resendTimer) clearInterval(this.resendTimer);
  }

  private getTime(date?: string): string {
    let cDate = new Date();
    if (date) {
      cDate = new Date(date);
    }
    return cDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
