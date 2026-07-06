import { Component, OnInit } from '@angular/core';
import { Course } from '../service/course.model';
import { ApiService } from '../service/noidaweb.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-program-search',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './program-search.component.html',
  styleUrl: './program-search.component.css'
})

export class ProgramSearchComponent implements OnInit{
  GetDisciplineCourseData: Course[] = [];
  GetPgDisciplineCourseData: Course[] = [];
  GetAllCourseCourseData: Course[] = [];
  filteredAllCourseData: Course[] = [];
  filteredDisciplineCourseData: Course[] = [];
  filteredPgDisciplineCourseData: Course[] = [];
  searchTerm: string = '';

  showAllCourses: boolean = false;
  showUndergraduateCourses: boolean = false;
  showPostgraduateCourses: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.GetAllCourseCourse();
    this.GetAllDisciplineCourse();
    this.GetPgCoursewithoutDiscipline();
  }

  onProgramLevelChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'AllPrograms') {
      this.showAllCourses = false;
      this.showUndergraduateCourses = false;
      this.showPostgraduateCourses = false;
    } else if (selectedValue === 'Postgraduate') {
      this.showPostgraduateCourses = true;
      this.showUndergraduateCourses = false;
      this.showAllCourses = false;
    } else {
      this.showUndergraduateCourses = true;
      this.showPostgraduateCourses = false;
      this.showAllCourses = false;
    }
  }

  GetAllCourseCourse(): void {
    this.apiService.GetAllCourseCampus().subscribe((data: Course[]) => {
      this.GetAllCourseCourseData = data;
    });
  }

  GetAllDisciplineCourse(): void {
    this.apiService.GetAllCoursewithoutDiscipline().subscribe((data: Course[]) => {
      this.GetDisciplineCourseData = data;
    });
  }

  GetPgCoursewithoutDiscipline(): void {
    this.apiService.GetAllPgCoursewithoutDiscipline().subscribe((data: Course[]) => {
      this.GetPgDisciplineCourseData = data;
    });
  }

  filterCourses(): void {
    const searchTerm = this.searchTerm?.trim().toLowerCase() || '';
  
    if (!searchTerm) {
      // Reset filters and visibility if the search term is empty
      this.filteredAllCourseData = [];
      this.filteredDisciplineCourseData = [];
      this.filteredPgDisciplineCourseData = [];
      this.showAllCourses = false;
      this.showUndergraduateCourses = false;
      this.showPostgraduateCourses = false;
      return;
    }
  
    // Helper functions for scoring matches
    const calculateScore = (keywords: string, slugName: string): number => {
      const keywordString = keywords?.toLowerCase() || '';
      const slugString = slugName?.toLowerCase() || '';
      const keywordArray = keywordString.split(/\s+/);
      const searchLower = searchTerm.toLowerCase();
  
      // Full phrase match in Keywords gets the highest score
      if (keywordString === searchLower) return 4;
  
      // Exact word match in Keywords gets a high score
      if (keywordArray.includes(searchLower)) return 3;
  
      // Prefix match in Keywords gets a moderate score
      if (keywordArray.some(word => word.startsWith(searchLower))) return 2;
  
      // Partial match in Keywords gets a lower score
      if (keywordString.includes(searchLower)) return 1.5;
  
      // Full phrase match in SlugName gets a score
      if (slugString === searchLower) return 1;
  
      // Partial match in SlugName gets the lowest score
      if (slugString.includes(searchLower)) return 0.5;
  
      // No match
      return 0;
    };
  
    // Prioritize and sort matches by score
    const prioritizeMatches = (courseList: any[]): any[] => {
      return courseList
        .map(course => ({
          ...course,
          score: calculateScore(course.Keywords, course.SlugName)
        }))
        .filter(course => course.score > 0) // Only include matches
        .sort((a, b) => b.score - a.score); // Sort by score descending
    };
  
    // Apply prioritized filtering for all course categories
    this.filteredAllCourseData = prioritizeMatches(this.GetAllCourseCourseData);
    this.filteredDisciplineCourseData = prioritizeMatches(this.GetDisciplineCourseData);
    this.filteredPgDisciplineCourseData = prioritizeMatches(this.GetPgDisciplineCourseData);
  
    // Update visibility flags
    this.showAllCourses = this.filteredAllCourseData.length > 0;
    this.showUndergraduateCourses = this.filteredDisciplineCourseData.length > 0;
    this.showPostgraduateCourses = this.filteredPgDisciplineCourseData.length > 0;
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
