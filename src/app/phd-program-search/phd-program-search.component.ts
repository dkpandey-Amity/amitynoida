import { Component } from '@angular/core';
import { Course } from '../service/course.model';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phd-program-search',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './phd-program-search.component.html',
  styleUrl: './phd-program-search.component.css'
})
export class PhdProgramSearchComponent {
  allPhdCourses: Course[] = [];
  filteredPhdCourses: Course[] = [];
  searchTerm: string = '';

  showphdeCourses: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadallPhdCourses();
  }

  loadallPhdCourses(): void {
    this.apiService.GetPhdCourseWithoutDeiscipline().subscribe({      
      next: (data: Course[]) => {
        this.allPhdCourses = data;        
        this.filteredPhdCourses = data; // Initialize filtered courses with all courses
      },
      error: (error) => {
        console.error('Error fetching postgraduate courses:', error);
      }
    
    });
  }

  filterCourses(): void {
    const searchTerm = this.searchTerm.trim().toLowerCase();

    if (!searchTerm) {
      // Reset filters and visibility if the search term is empty
      this.filteredPhdCourses = this.allPhdCourses; // Reset to all courses
      this.showphdeCourses = false;
      return;
    }

    const calculateScore = (keywords: string, slugName: string): number => {
      const keywordString = keywords?.toLowerCase() || '';
      const slugString = slugName?.toLowerCase() || '';
      const keywordArray = keywordString.split(/\s+/);

      if (keywordString === searchTerm) return 4;
      if (keywordArray.includes(searchTerm)) return 3;
      if (keywordArray.some((word) => word.startsWith(searchTerm))) return 2;
      if (keywordString.includes(searchTerm)) return 1.5;
      if (slugString === searchTerm) return 1;
      if (slugString.includes(searchTerm)) return 0.5;

      return 0;
    };

    const prioritizeMatches = (courses: Course[]): Course[] => {
      return courses
        .map((course) => ({
          ...course,
          score: calculateScore(course.Keywords, course.SlugName),
        }))
        .filter((course) => course.score > 0) // Only include matches
        .sort((a, b) => b.score - a.score); // Sort by score descending
    };

    this.filteredPhdCourses = prioritizeMatches(this.allPhdCourses);

    // Update visibility flags
    this.showphdeCourses = this.filteredPhdCourses.length > 0;
  }

  onSearchTermChange(): void {
    this.filterCourses();
  }

  formatFacultyName(sfullname: string): string {
    return sfullname
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
