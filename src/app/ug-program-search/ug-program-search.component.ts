import { Component, OnInit } from '@angular/core';
import { Course } from '../service/course.model';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ug-program-search',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './ug-program-search.component.html',
  styleUrl: './ug-program-search.component.css'
})
export class UgProgramSearchComponent {
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';

  showUndergraduateCourses: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAllCourses();
  }

  onProgramLevelChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    this.showUndergraduateCourses = selectedValue === 'Undergraduate';
  }

  loadAllCourses(): void {
    this.apiService.GetAllCoursewithoutDiscipline().subscribe(
      (data: Course[]) => {
        this.allCourses = data;
        this.filteredCourses = data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  filterCourses(): void {
    const searchTerm = this.searchTerm.trim().toLowerCase();

    if (!searchTerm) {
      this.filteredCourses = this.allCourses; // Reset to all courses
      this.showUndergraduateCourses = false;
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
        .filter((course) => course.score > 0)
        .sort((a, b) => b.score - a.score);
    };

    this.filteredCourses = prioritizeMatches(this.allCourses);
    this.showUndergraduateCourses = this.filteredCourses.length > 0;
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
