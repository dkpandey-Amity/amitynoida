import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}

  setMeta(metaData: any) {
    if (!metaData) return;

    const canonicalUrl = metaData.CanonicalUrl || window.location.href;

    const title = metaData.Title || 'Amity University Noida';

    const description = metaData.Description || 'Amity University Noida';

    const keywords = metaData.Keywords || 'Amity University Noida';

    const image = 'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

    // ===== BASIC =====
    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // ===== OG =====
    this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({
      property: 'og:site_name',
      content: 'Amity University Noida',
    });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: title });

    // ===== TWITTER =====
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: title });
    this.meta.updateTag({ name: 'twitter:site', content: '@AmityUni' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@AmityUni' });

    // ===== CANONICAL =====
    this.setCanonical(canonicalUrl);
  }

  private setCanonical(url: string) {
    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]',
    );

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
