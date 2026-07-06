import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventpipe',
  standalone: true
})
export class EventpipePipe implements PipeTransform {

  transform(value: string): string {
    // Create a new DOMParser
    const parser = new DOMParser();
    // Parse the HTML string into a Document
    const doc = parser.parseFromString(value, 'text/html');
    // Extract text content and trim it
    return doc.body.textContent?.trim() || '';
  }
}
