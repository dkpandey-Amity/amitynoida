import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'cleanHtmlPtag',
  standalone: true
})
export class CleanHtmlPtagPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;

    // Remove <p> tags but keep their content
    tempElement.querySelectorAll('p').forEach(p => {
      const childNodesArray = Array.from(p.childNodes);
      p.replaceWith(...childNodesArray);
    });

    // ✅ Return sanitized HTML so Angular doesn't strip <u> tags
    return this.sanitizer.bypassSecurityTrustHtml(tempElement.innerHTML);
  }
}
