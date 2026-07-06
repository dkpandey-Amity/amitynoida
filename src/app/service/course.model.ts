export interface Course {
  sfullname: string;
  sDiscipline: string;
  sCourseCode: string;
  bAdmissionOpen: number; // Ensure this property exists
  CourseCD: string; // Include this if it's also part of the data
  SlugName: string;
  Keywords: string;
  stype: string; 
  Disciplineslugname: string; // Include this if it's part of the data
  // Add any other properties that the Course might have
  
}