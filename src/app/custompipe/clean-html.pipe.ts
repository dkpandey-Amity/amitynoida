import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'cleanHtml',
  standalone: true
})
export class CleanHtmlPipe implements PipeTransform {

  private readonly allowedTags = new Set([
    'b', 'i', 'strong', 'u', 'p', 'br', 'ul', 'li', 'ol', 'em', 'span', 'div', 'table',
    'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'sub', 'sup', 'mark', 'small'
  ]);

  
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Create regex to allow only specific tags
    const allowedTagsRegex = Array.from(this.allowedTags).join('|');

    // Strip disallowed tags
    const cleanedValue = value.replace(new RegExp(`<(?!/?(${allowedTagsRegex})\\b)[^>]+>`, 'gi'), '');

    // ✅ Mark as safe so Angular doesn't strip <u> or inline styles
    return this.sanitizer.bypassSecurityTrustHtml(cleanedValue);
  }
}
