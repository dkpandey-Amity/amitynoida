import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-old-url-redirec',
  standalone: true,
  imports: [],
  template: '',
})
export class OldUrlRedirecComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;

    const discipline = params['Disciplineslugname'];
    const slug = params['SlugName'];
    const id = params['id'];

    const currentUrl = this.router.url;

    // =========================================
    // DOUBLE HYPHEN REDIRECT
    // =========================================

    if (currentUrl.includes('--')) {
      const cleanUrl = currentUrl.replace(/--+/g, '-');

      this.router.navigateByUrl(cleanUrl, {
        replaceUrl: true,
      });

      return;
    }

    // =========================
    // ONLY REDIRECT IF ID IS NUMERIC
    // =========================

    if (!id || isNaN(Number(id))) {
      return;
    }

    // =========================
    // UG
    // =========================

    if (currentUrl.includes('/ug/')) {
      // DETAILS PAGE
      if (slug) {
        this.router.navigate(['/ug', discipline, slug], { replaceUrl: true });
      }

      // LIST PAGE
      else {
        this.router.navigate(['/ug', discipline], { replaceUrl: true });
      }

      return;
    }

    // =========================
    // PG
    // =========================

    if (currentUrl.includes('/pg/')) {
      // DETAILS PAGE
      if (slug) {
        this.router.navigate(['/pg', discipline, slug], { replaceUrl: true });
      }

      // LIST PAGE
      else {
        this.router.navigate(['/pg', discipline], { replaceUrl: true });
      }

      return;
    }

    // =========================
    // PHD
    // =========================

    if (currentUrl.includes('/phd/')) {
      // DETAILS PAGE
      if (slug) {
        this.router.navigate(['/phd', discipline, slug], { replaceUrl: true });
      }

      // LIST PAGE
      else {
        this.router.navigate(['/phd', discipline], { replaceUrl: true });
      }

      return;
    }

    // =========================
    // INDUSTRY UG PROGRAMS
    // =========================

    if (currentUrl.includes('/industry-ug-programs/')) {
      this.router.navigate(['/industry-ug-programs', slug], {
        replaceUrl: true,
      });

      return;
    }

    // =========================
    // UG 3 CONTINENT
    // =========================

    if (currentUrl.includes('/ug-3-continent/')) {
      this.router.navigate(['/ug-3-continent', slug], { replaceUrl: true });

      return;
    }

    // =========================
    // UG INTERNATIONAL PROGRAMMES
    // =========================

    if (currentUrl.includes('/ug-international-programmes/')) {
      this.router.navigate(['/ug-international-programmes', slug], {
        replaceUrl: true,
      });

      return;
    }

    // =========================
    // INTEGRATED PROGRAMS
    // =========================

    if (currentUrl.includes('/integrated-programs/')) {
      this.router.navigate(['/integrated-programs', slug], {
        replaceUrl: true,
      });

      return;
    }

    // =========================
    // UG EVENING PROGRAM
    // =========================

    if (currentUrl.includes('/ug-evening-program/')) {
      this.router.navigate(['/ug-evening-program', slug], { replaceUrl: true });

      return;
    }

    // =========================
    // PG INDUSTRY PROGRAM
    // =========================

    if (currentUrl.includes('/pg-industry-program/')) {
      this.router.navigate(['/pg-industry-program', slug], {
        replaceUrl: true,
      });

      return;
    }

    // =========================
    // PG 3 CONTINENT
    // =========================

    if (currentUrl.includes('/pg-3-continent/')) {
      this.router.navigate(['/pg-3-continent', slug], { replaceUrl: true });

      return;
    }

    // =========================
    // PG INTERNATIONAL PROGRAMMES
    // =========================

    if (currentUrl.includes('/pg-international-programmes/')) {
      this.router.navigate(['/pg-international-programmes', slug], {
        replaceUrl: true,
      });

      return;
    }

    // =========================
    // PG INTEGRATED PROGRAMMES
    // =========================

    if (currentUrl.includes('/pg-integrated-programmes/')) {
      this.router.navigate(['/pg-integrated-programmes', slug], {
        replaceUrl: true,
      });

      return;
    }

    // =========================
    // PG EVENING PROGRAM
    // =========================

    if (currentUrl.includes('/pg-evening-program/')) {
      this.router.navigate(['/pg-evening-program', slug], { replaceUrl: true });

      return;
    }

    // =========================
    // FACULTY
    // =========================

    if (currentUrl.includes('/faculty/')) {
      const facultySlug = params['FacultySlug'];

      this.router.navigate(['/faculty', facultySlug], { replaceUrl: true });

      return;
    }

    // =========================
    // FALLBACK
    // =========================

    // =========================
    // EVENTS
    // =========================

    if (currentUrl.includes('/events/')) {
      this.router.navigate(['/events', slug], { replaceUrl: true });

      return;
    }

    this.router.navigate(['/'], { replaceUrl: true });
  }
}
