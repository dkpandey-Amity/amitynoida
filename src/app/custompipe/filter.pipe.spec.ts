import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items; // Return original items if no filter is applied
    }

    searchTerm = searchTerm.toLowerCase(); // Make the search term case-insensitive

    return items.filter(item => 
      item.sfullname.toLowerCase().includes(searchTerm) // Adjust property name as needed
    );
  }
}
