import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/noidaweb.service';

declare var $: any;

@Component({
  selector: 'app-placements-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placements-data.component.html',
  styleUrl: './placements-data.component.css',
  encapsulation: ViewEncapsulation.Emulated,
})
export class PlacementsDataComponent implements AfterViewInit, OnDestroy {
  // Separate indices for different sliders
  placementSliderIndex = 0;
  amitiansSliderIndex = 0;
  
  // Add these for auto-sliding
  private autoSlideInterval: any = null;
  private readonly AUTO_SLIDE_INTERVAL = 5000; // 5 seconds (change as needed)
  private isHovering = false;
  
  private windowResizeListener: (() => void) | null = null;

  // Tabs data
  tabs = [
    { title: 'Technology', subtitle: '& IT' },
    { title: 'IT Services', subtitle: '& Consulting' },
    { title: 'Banking &', subtitle: 'Financial Services' },
    { title: 'Healthcare', subtitle: '& Pharma' },
    { title: 'Manufacturing', subtitle: '& Engineering' },
    { title: 'FMCG &', subtitle: 'Consumer Goods' },
    { title: 'Media &', subtitle: 'Communication' },
  ];

  activeTab = 0;
  activeStep = 0;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.updateMetaTags();
  }

   ngAfterViewInit(): void {
    setTimeout(() => {
      this.initTabs();
      this.initAccordion();
      this.initCountAnimation();
      
      // Initialize both sliders
      setTimeout(() => {
        this.updatePlacementSlider();
        this.updateAmitiansSlider();
        
        // Start auto-sliding for both sliders
        this.startAutoSlide();
      }, 100);
      
      // Add resize listener
      this.windowResizeListener = () => {
        this.updatePlacementSlider();
        this.updateAmitiansSlider();
      };
      window.addEventListener('resize', this.windowResizeListener);
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.windowResizeListener) {
      window.removeEventListener('resize', this.windowResizeListener);
    }
    // Stop auto-sliding when component is destroyed
    this.stopAutoSlide();
  }

   startAutoSlide() {
    this.stopAutoSlide(); // Clear any existing interval
    
    this.autoSlideInterval = setInterval(() => {
      if (!this.isHovering) {
        // Auto advance both sliders
        this.nextPlacement();
        this.nextAmitians();
      }
    }, this.AUTO_SLIDE_INTERVAL);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  onSliderMouseEnter() {
    this.isHovering = true;
    this.stopAutoSlide();
  }

  onSliderMouseLeave() {
    this.isHovering = false;
    this.startAutoSlide();
  }


  // ================= PLACEMENT SLIDER METHODS =================

  nextPlacement() {
    const maxIndex = this.getPlacementMaxIndex();
    this.placementSliderIndex = this.placementSliderIndex >= maxIndex ? 0 : this.placementSliderIndex + 1;
    this.updatePlacementSlider();
    this.resetAutoSlideTimer();
  }

  prevPlacement() {
    const maxIndex = this.getPlacementMaxIndex();
    this.placementSliderIndex = this.placementSliderIndex <= 0 ? maxIndex : this.placementSliderIndex - 1;
    this.updatePlacementSlider();
    this.resetAutoSlideTimer();
  }


  resetAutoSlideTimer() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  updatePlacementSlider() {
    const track = document.querySelector(
      '.placements .slider-track',
    ) as HTMLElement;
    const items = document.querySelectorAll('.placements .slider-track .item');

    if (!track || items.length === 0) return;

    // Get the actual width including margins
    const itemElement = items[0] as HTMLElement;
    const itemWidth = itemElement.offsetWidth;
    const gap = 20; // gap from CSS
    const slideWidth = itemWidth + gap;

    const translateX = -(this.placementSliderIndex * slideWidth);

    track.style.transform = `translateX(${translateX}px)`;
    track.style.transition = 'transform 0.4s ease-in-out';
  }

  getPlacementMaxIndex(): number {
    const track = document.querySelector('.placements .slider-track');
    const items = track?.children.length || 0;

    let visible = 3;
    if (window.innerWidth < 768) {
      visible = 1;
    } else if (window.innerWidth < 1024) {
      visible = 2;
    }

    return Math.max(0, items - visible);
  }

  // ================= AMITIANS SLIDER METHODS =================

  nextAmitians() {
    const maxIndex = this.getAmitiansMaxIndex();
    this.amitiansSliderIndex =
      this.amitiansSliderIndex >= maxIndex ? 0 : this.amitiansSliderIndex + 1;
    this.updateAmitiansSlider();
  }

  prevAmitians() {
    const maxIndex = this.getAmitiansMaxIndex();
    this.amitiansSliderIndex =
      this.amitiansSliderIndex <= 0 ? maxIndex : this.amitiansSliderIndex - 1;
    this.updateAmitiansSlider();
  }

  updateAmitiansSlider() {
    const track = document.querySelector(
      '.amitians .slider-track',
    ) as HTMLElement;
    const items = document.querySelectorAll('.amitians .slider-track .item');

    if (!track || items.length === 0) return;

    // Get the actual width of first item including margins
    const itemElement = items[0] as HTMLElement;
    const itemWidth = itemElement.offsetWidth;

    // Get the gap from CSS
    const computedStyle = window.getComputedStyle(track);
    const gap = parseInt(computedStyle.gap) || 20;

    const slideWidth = itemWidth + gap;
    const translateX = -(this.amitiansSliderIndex * slideWidth);

    track.style.transform = `translateX(${translateX}px)`;
    track.style.transition = 'transform 0.4s ease-in-out';
  }

  getAmitiansMaxIndex(): number {
    const track = document.querySelector('.amitians .slider-track');
    const items = track?.children.length || 0;

    let visible = 3;
    if (window.innerWidth < 768) {
      visible = 1;
    } else if (window.innerWidth < 1024) {
      visible = 2;
    }

    return Math.max(0, items - visible);
  }

  // ================= TABS METHODS =================

  setTab(index: number) {
    this.activeTab = index;
  }

  // In your component class, add this property
  activeFaqStep: number = 0; // Separate from your existing activeStep

  // Update your toggleStep method for FAQ
  toggleFaqStep(index: number) {
    this.activeFaqStep = this.activeFaqStep === index ? -1 : index;
  }

  initTabs() {
    // Custom tab initialization without jQuery plugin
    const tabs = document.querySelectorAll('.resp-tabs-list li');
    const containers = document.querySelectorAll('.resp-tabs-container > div');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove('resp-tab-active'));
        // Add active class to clicked tab
        tab.classList.add('resp-tab-active');

        // Hide all containers
        containers.forEach((container) => {
          (container as HTMLElement).style.display = 'none';
        });

        // Show selected container
        if (containers[index]) {
          (containers[index] as HTMLElement).style.display = 'block';
        }

        this.activeTab = index;
      });
    });

    // Activate first tab by default
    if (tabs.length > 0) {
      tabs[0].classList.add('resp-tab-active');
      if (containers[0]) {
        (containers[0] as HTMLElement).style.display = 'block';
      }
    }
  }

  // ================= ACCORDION METHODS =================

  toggleStep(index: number) {
    this.activeStep = this.activeStep === index ? -1 : index;
  }

  initAccordion() {
    // Initialize all accordions on the page
    const accordionGroups = document.querySelectorAll('.accrodion-grp');

    accordionGroups.forEach((group) => {
      const accordions = group.querySelectorAll('.accrodion');

      accordions.forEach((accordion) => {
        const title = accordion.querySelector('.accrodion-title');
        if (title) {
          title.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = accordion.classList.contains('active');

            // Close all accordions in this group
            accordions.forEach((a) => a.classList.remove('active'));

            // Open clicked accordion if it wasn't active
            if (!isActive) {
              accordion.classList.add('active');
            }
          });
        }
      });
    });
  }

  // ================= COUNT ANIMATION =================

  initCountAnimation() {
    let counted = false;

    const checkCount = () => {
      const countElements = document.querySelectorAll('.count');
      if (!countElements.length) return;

      const firstCount = countElements[0];
      const rect = firstCount.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      const offset = rect.top + scrollTop;

      if (!counted && scrollTop + windowHeight > offset) {
        countElements.forEach((element) => {
          const el = element as HTMLElement;
          const value = parseInt(el.textContent?.replace(/,/g, '') || '0');
          let current = 0;

          const timer = setInterval(() => {
            current += Math.ceil(value / 50);
            if (current >= value) {
              el.textContent = value.toLocaleString('en');
              clearInterval(timer);
            } else {
              el.textContent = current.toLocaleString('en');
            }
          }, 30);
        });

        counted = true;
        window.removeEventListener('scroll', checkCount);
      }
    };

    window.addEventListener('scroll', checkCount);
    // Trigger once on load
    setTimeout(checkCount, 500);
  }

  // ================= META TAGS METHODS =================

  updateMetaTags(): void {
    this.apiService.getPlacementsMeta().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const metaData = data[0];

          this.titleService.setTitle(
            metaData.Title || 'Amity University, Noida',
          );
          this.meta.updateTag({
            name: 'description',
            content: metaData.Description || 'Amity University, Noida',
          });
          this.meta.updateTag({
            name: 'keywords',
            content: metaData.Keywords || 'Amity University, Noida',
          });

          const canonicalUrl = metaData.CanonicalUrl || window.location.href;
          const title =
            metaData.Title || 'Placements – Amity University Noida';
          const description =
            metaData.Description ||
            'Explore detailed placements data at Amity University Noida including internships, recruiter participation, salary packages, and placement trends.';
          const imageUrl =
            'https://noida.amity.edu/assets/img/breadcrump_bg.jpg';

          // Open Graph
          this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });
          this.meta.updateTag({ property: 'og:type', content: 'website' });
          this.meta.updateTag({ property: 'og:title', content: title });
          this.meta.updateTag({
            property: 'og:description',
            content: description,
          });
          this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
          this.meta.updateTag({
            property: 'og:site_name',
            content: 'Amity University Noida',
          });
          this.meta.updateTag({ property: 'og:image', content: imageUrl });
          this.meta.updateTag({ property: 'og:image:alt', content: title });

          // Twitter
          this.meta.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
          });
          this.meta.updateTag({ name: 'twitter:title', content: title });
          this.meta.updateTag({
            name: 'twitter:description',
            content: description,
          });
          this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
          this.meta.updateTag({ name: 'twitter:image:alt', content: title });
          this.meta.updateTag({ name: 'twitter:site', content: '@AmityUni' });
          this.meta.updateTag({
            name: 'twitter:creator',
            content: '@AmityUni',
          });

          this.setCanonicalLink(canonicalUrl);
          this.injectStructuredData(metaData);
        }
      },
      error: (error: any) => {
        console.error('Error fetching meta data from API:', error);
        this.setCanonicalLink(window.location.href);
      },
    });
  }

  injectStructuredData(metaData: any): void {
    const baseUrl = 'https://noida.amity.edu';
    const canonicalUrl = metaData.CanonicalUrl || window.location.href;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: metaData.Title || 'Placements Data – Amity University Noida',
          description:
            metaData.Description ||
            'Detailed placements data at Amity University Noida covering internships, recruiters, salary packages, and placement trends.',
          isPartOf: { '@id': `${baseUrl}#website` },
          mainEntity: { '@id': `${canonicalUrl}#placements-dataset` },
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        },
        {
          '@type': 'Dataset',
          '@id': `${canonicalUrl}#placements-dataset`,
          name: 'Amity University Noida Placements Data',
          description:
            'Comprehensive dataset including placement records, internship offers, recruiter participation, and salary statistics.',
          url: canonicalUrl,
          creator: { '@id': `${baseUrl}#university` },
          publisher: { '@id': `${baseUrl}#university` },
          keywords: [
            'placements data',
            'internships',
            'recruiters',
            'salary packages',
            'placement records',
          ],
          variableMeasured: [
            'Highest Salary',
            'Average Salary',
            'Median Salary',
            'Internship Offers',
            'Recruiting Companies',
            'Placement Percentage',
          ],
          dateModified: metaData.LastUpdated || '2025-07-01',
        },
        {
          '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
          '@id': `${baseUrl}#university`,
          name: 'Amity University Noida',
          url: baseUrl,
          logo: `${baseUrl}/assets/images/amity-logo.png`,
          foundingDate: '2005',
          description:
            'Amity University Noida is a leading private university with strong industry integration and placement performance.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sector 125',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201301',
            addressCountry: 'IN',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '0120-2445252',
            contactType: 'admissions',
            areaServed: 'IN',
          },
          sameAs: [
            'https://www.facebook.com/amityuni',
            'https://www.instagram.com/amityuniversity/',
            'https://www.linkedin.com/school/amity-university/',
            'https://twitter.com/AmityUni',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${baseUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Placements Data',
              item: canonicalUrl,
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          url: baseUrl,
          name: 'Amity University Noida',
          publisher: { '@id': `${baseUrl}#university` },
        },
      ],
    };

    const existingScript = document.getElementById('structured-data');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private setCanonicalLink(url: string): void {
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
