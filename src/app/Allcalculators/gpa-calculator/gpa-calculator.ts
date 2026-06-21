import { ChangeDetectionStrategy, Component, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Course {
  id: number;
  name: string;
  credits: number | null;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

@Component({
  selector: 'app-gpa-calculator',
  imports: [CommonModule, DecimalPipe, FormsModule, RouterLink],
  templateUrl: './gpa-calculator.html',
  styleUrls: ['./gpa-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpaCalculatorComponent {
  gradeOptions = Object.keys(GRADE_POINTS);
  private nextId = 1;

  courses = signal<Course[]>([
    { id: this.nextId++, name: 'Mathematics', credits: 3, grade: 'A' },
    { id: this.nextId++, name: 'Physics', credits: 4, grade: 'B+' },
    { id: this.nextId++, name: 'English', credits: 3, grade: 'A-' },
    { id: this.nextId++, name: 'Chemistry', credits: 3, grade: 'B' },
  ]);

  gpa = computed(() => {
    const validCourses = this.courses().filter(c => c.credits !== null && c.credits > 0 && c.grade in GRADE_POINTS);
    if (validCourses.length === 0) return null;
    const totalPoints = validCourses.reduce((sum, c) => sum + (c.credits! * GRADE_POINTS[c.grade]), 0);
    const totalCredits = validCourses.reduce((sum, c) => sum + c.credits!, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : null;
  });

  totalCredits = computed(() =>
    this.courses().filter(c => c.credits !== null && c.credits > 0).reduce((sum, c) => sum + c.credits!, 0)
  );

  gpaCategory = computed(() => {
    const g = this.gpa();
    if (g === null) return '';
    if (g >= 3.7) return 'Summa Cum Laude (A)';
    if (g >= 3.3) return 'Magna Cum Laude (A-)';
    if (g >= 3.0) return 'Cum Laude (B)';
    if (g >= 2.0) return 'Satisfactory (C)';
    return 'Below Average (Needs Improvement)';
  });

  addCourse() {
    this.courses.update(c => [...c, { id: this.nextId++, name: '', credits: 3, grade: 'B' }]);
  }

  removeCourse(id: number) {
    if (this.courses().length <= 1) return;
    this.courses.update(c => c.filter(course => course.id !== id));
  }

  updateCourseName(id: number, name: string) {
    this.courses.update(c => c.map(course => course.id === id ? { ...course, name } : course));
  }

  updateCourseCredits(id: number, credits: number | null) {
    this.courses.update(c => c.map(course => course.id === id ? { ...course, credits } : course));
  }

  updateCourseGrade(id: number, grade: string) {
    this.courses.update(c => c.map(course => course.id === id ? { ...course, grade } : course));
  }

  gradePointOf(grade: string): number {
    return GRADE_POINTS[grade] ?? 0;
  }
}
